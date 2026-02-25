import { createClient } from "@/lib/supabase/client";

export interface PhoneSignupData {
  phone: string;
  full_name: string;
  role: "expediteur" | "transporteur";
  company_name: string;
  company_country: string;
}

export interface VerifyOtpParams {
  phone: string;
  token: string;
}

/**
 * Envoie un OTP SMS au numéro de téléphone pour inscription/connexion.
 * Crée l'utilisateur à la vérification si shouldCreateUser est true (défaut).
 * Les options.data sont stockées dans user_metadata à la création du compte.
 */
export async function signInWithOtpPhone(
  phone: string,
  options?: { data?: Record<string, unknown>; shouldCreateUser?: boolean }
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizePhone(phone),
    options: {
      shouldCreateUser: options?.shouldCreateUser ?? true,
      data: options?.data ?? undefined,
    },
  });
  return { error: error ?? null };
}

/**
 * Vérifie le code OTP à 6 chiffres reçu par SMS.
 */
export async function verifyOtp({
  phone,
  token,
}: VerifyOtpParams): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    phone: normalizePhone(phone),
    token,
    type: "sms",
  });
  return { error: error ?? null };
}

/**
 * Normalise le numéro au format E.164 (ex: +229XXXXXXXX).
 */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("229") && cleaned.length === 11) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("228") && cleaned.length === 11) {
    return `+${cleaned}`;
  }
  if (phone.startsWith("+")) return phone;
  return `+${cleaned}`;
}
