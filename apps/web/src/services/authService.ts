import { createClient } from "@/lib/supabase/client";

export interface EmailSignupData {
  email: string;
  full_name: string;
  role: "expediteur" | "transporteur";
  company_name: string;
  company_country: string;
}

export interface VerifyOtpEmailParams {
  email: string;
  token: string;
}

/**
 * Envoie un OTP par email pour inscription/connexion.
 * Crée l'utilisateur à la vérification si shouldCreateUser est true (défaut).
 * Les options.data sont stockées dans user_metadata à la création du compte.
 */
export async function signInWithOtpEmail(
  email: string,
  options?: { data?: Record<string, unknown>; shouldCreateUser?: boolean }
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: options?.shouldCreateUser ?? true,
      data: options?.data ?? undefined,
    },
  });
  return { error: error ?? null };
}

/**
 * Vérifie le code OTP à 6 chiffres reçu par email.
 */
export async function verifyOtpEmail({
  email,
  token,
}: VerifyOtpEmailParams): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token,
    type: "email",
  });
  return { error: error ?? null };
}
