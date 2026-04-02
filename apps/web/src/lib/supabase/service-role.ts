import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** URL projet (serveur : SUPABASE_URL ; client : NEXT_PUBLIC_SUPABASE_URL). */
export function getSupabaseProjectUrl(): string | null {
  const raw =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/+$/, "");
}

export function getServiceRoleKey(): string | null {
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return k || null;
}

/**
 * Client serveur uniquement — ne jamais exposer SUPABASE_SERVICE_ROLE_KEY au navigateur.
 * Utilisé pour les écritures qui contournent RLS (ex. enregistrement des leads).
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = getSupabaseProjectUrl();
  const key = getServiceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
