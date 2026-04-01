import type { LeadType } from "@prisma/client";
import { z } from "zod";
import { leadSchema, type LeadPayload } from "@transmit/validations";
import { prisma } from "@/lib/db";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

export type PersistChannel = "api" | "supabase" | "prisma";

/**
 * Enregistre une lead (validation Zod identique à l’API Fastify).
 * Chaîne : Fastify → Supabase REST (service_role) → Prisma direct (DATABASE_URL).
 */
export async function persistLead(
  payload: Record<string, unknown>
): Promise<{ ok: boolean; channel: PersistChannel | null }> {
  if (await saveLeadToApi(payload)) {
    return { ok: true, channel: "api" };
  }
  if (await saveLeadViaSupabase(payload)) {
    return { ok: true, channel: "supabase" };
  }
  if (await saveLeadDirectToDb(payload)) {
    return { ok: true, channel: "prisma" };
  }
  return { ok: false, channel: null };
}

/** Log unique au chargement du module sur Vercel si aucun canal n’est configuré. */
export function warnIfNoPersistenceChannel(): void {
  if (process.env.VERCEL !== "1") return;
  const hasApi = !!(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL);
  const hasSupabase = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasDb = !!process.env.DATABASE_URL;
  if (!hasApi && !hasSupabase && !hasDb) {
    console.error(
      "[Leads] Aucun canal d’enregistrement : définir au moins NEXT_PUBLIC_API_URL (ou API_URL), ou SUPABASE_SERVICE_ROLE_KEY, ou DATABASE_URL sur Vercel."
    );
  }
}

async function saveLeadToApi(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/leads`, {
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

async function saveLeadViaSupabase(
  payload: Record<string, unknown>
): Promise<boolean> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return false;
  }
  try {
    const parsed = leadSchema.parse(payload);
    const row = prismaDataFromLeadPayload(parsed);
    const { error } = await supabase.from("leads").insert({
      type: row.type,
      name: row.name ?? null,
      email: row.email ?? null,
      phone: row.phone ?? null,
      company: row.company ?? null,
      message: row.message ?? null,
      metadata: row.metadata ?? null,
    });
    if (error) {
      console.error("[Leads] Supabase REST:", error.message, error.code);
      return false;
    }
    console.info("[Leads] OK via Supabase REST");
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
