import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/types/database.types";

export interface CurrentUser {
  id: string;
  email: string | null;
  role: AppRole;
  full_name: string | null;
  company_id: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, company_id")
    .eq("id", authUser.id)
    .single();

  return {
    id: authUser.id,
    email: authUser.email ?? null,
    role: (profile?.role as AppRole) ?? "expediteur",
    full_name: profile?.full_name ?? null,
    company_id: profile?.company_id ?? null,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
