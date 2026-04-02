import type { LeadType } from "@prisma/client";
import { z } from "zod";
import { leadSchema, type LeadPayload } from "@transmit/validations";
import { prisma } from "@/lib/db";
import {
  getServiceRoleKey,
  getSupabaseProjectUrl,
} from "@/lib/supabase/service-role";

/** True on Vercel / serverless cloud (not `next dev` local). */
function isCloudRuntime(): boolean {
  return process.env.VERCEL === "1" || !!process.env.VERCEL_ENV;
}

function getApiBaseUrl(): string {
  return (
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:4000"
  );
}

function isLoopbackUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "[::1]"
    );
  } catch {
    return true;
  }
}

/** Non-empty API URL that is not localhost (counts as “configured” for Vercel warnings). */
function hasRemoteApiUrl(): boolean {
  const raw = process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  return !!raw && !isLoopbackUrl(raw);
}

export type PersistChannel = "api" | "supabase" | "prisma";

/**
 * Enregistre une lead (validation Zod identique à l’API Fastify).
 * Ordre : Supabase REST (typique Vercel + service_role) → Fastify → Prisma direct.
 * Sur Vercel sans NEXT_PUBLIC_API_URL / API_URL, on n’appelle pas localhost:4000.
 */
export async function persistLead(
  payload: Record<string, unknown>
): Promise<{ ok: boolean; channel: PersistChannel | null }> {
  if (await saveLeadViaSupabase(payload)) {
    return { ok: true, channel: "supabase" };
  }
  if (await saveLeadToApi(payload)) {
    return { ok: true, channel: "api" };
  }
  if (await saveLeadDirectToDb(payload)) {
    return { ok: true, channel: "prisma" };
  }
  return { ok: false, channel: null };
}

/** Log unique au chargement du module sur Vercel si aucun canal n’est configuré. */
export function warnIfNoPersistenceChannel(): void {
  if (!isCloudRuntime()) return;
  const hasApi = hasRemoteApiUrl();
  const hasSupabase = !!(getServiceRoleKey() && getSupabaseProjectUrl());
  const hasDb = !!process.env.DATABASE_URL?.trim();
  if (!hasApi && !hasSupabase && !hasDb) {
    console.error(
      "[Leads] Aucun canal d’enregistrement : sur Vercel, définir SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL, ou NEXT_PUBLIC_API_URL / API_URL (URL publique, pas localhost), ou DATABASE_URL."
    );
  }
}

async function saveLeadToApi(payload: Record<string, unknown>): Promise<boolean> {
  const apiBase = getApiBaseUrl();
  if (isCloudRuntime() && isLoopbackUrl(apiBase)) {
    console.warn(
      "[Leads] API Fastify ignorée : l’URL de l’API est localhost — sur Vercel, utilisez l’URL publique (Railway, etc.), pas une copie de .env.local."
    );
    return false;
  }
  if (isCloudRuntime() && !hasRemoteApiUrl()) {
    return false;
  }
  try {
    const res = await fetch(`${apiBase}/api/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        "[Leads] API Fastify:",
        res.status,
        detail.slice(0, 500)
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Leads] API Fastify exception:", err);
    return false;
  }
}

function prismaDataFromLeadPayload(parsed: LeadPayload) {
  const { type, name, email, phone, company, message, ...metadata } = parsed;
  return {
    type: type as LeadType,
    name: name?.trim() || undefined,
    email: email?.trim() || undefined,
    phone: phone?.trim() || undefined,
    company: company?.trim() || undefined,
    message: message?.trim() || undefined,
    metadata: Object.keys(metadata).length ? metadata : undefined,
  };
}

/**
 * Insert via PostgREST (fetch) — plus prévisible que le client JS sur Vercel serverless.
 * Headers identiques au client Supabase (apikey + Bearer service_role).
 */
async function saveLeadViaSupabase(
  payload: Record<string, unknown>
): Promise<boolean> {
  const baseUrl = getSupabaseProjectUrl();
  const key = getServiceRoleKey();
  if (!baseUrl || !key) {
    return false;
  }
  try {
    const parsed = leadSchema.parse(payload);
    const row = prismaDataFromLeadPayload(parsed);
    const body = {
      type: row.type,
      name: row.name ?? null,
      email: row.email ?? null,
      phone: row.phone ?? null,
      company: row.company ?? null,
      message: row.message ?? null,
      metadata: row.metadata ?? null,
    };

    const res = await fetch(`${baseUrl}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        "[Leads] PostgREST leads:",
        res.status,
        detail.slice(0, 800)
      );
      return false;
    }
    console.info("[Leads] OK via PostgREST (Supabase)");
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.warn("[Leads] Zod (Supabase):", err.flatten());
    } else {
      console.error("[Leads] Supabase exception:", err);
    }
    return false;
  }
}

async function saveLeadDirectToDb(
  payload: Record<string, unknown>
): Promise<boolean> {
  if (!process.env.DATABASE_URL?.trim()) {
    return false;
  }
  try {
    const parsed = leadSchema.parse(payload);
    await prisma.lead.create({
      data: prismaDataFromLeadPayload(parsed),
    });
    console.info("[Leads] OK via Prisma direct");
    return true;
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.warn("[Leads] Zod (Prisma):", err.flatten());
    } else {
      console.error("[Leads] Prisma direct:", err);
    }
    return false;
  }
}
