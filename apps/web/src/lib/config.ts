/** Email de contact pour les formulaires et affichage */
export const CONTACT_EMAIL = "hello@trans-meet.com";

/** Numéro de téléphone (format international) */
export const CONTACT_PHONE = "+229 01 62 68 16 83";

/** Numéro WhatsApp pour wa.me (sans + ni espaces) */
export const WHATSAPP_NUMBER = "2290162681683";

/**
 * En dev unifié : tout sur localhost:3000 (rewrites proxy vers transmeet-app:3001).
 * En prod : APP_URL pour l'app séparée si besoin.
 */
export const APP_ROUTES = {
  login: () => "/login",
  register: (role?: "expediteur" | "transporteur") => {
    const base = "/register";
    return role ? `${base}?role=${role}` : base;
  },
  dashboard: () => "/dashboard",
} as const;
