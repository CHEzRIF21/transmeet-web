/**
 * Email de contact public (footer, pages légales, mailto, page contact).
 *
 * Destinataire par défaut des notifications Resend (tous les formulaires / leads) :
 * `hello@trans-meet.com` sauf si `LEADS_EMAIL` est défini (Vercel / .env). Voir
 * apps/web/src/app/api/leads/route.ts — `process.env.LEADS_EMAIL ?? CONTACT_EMAIL`.
 * Pour changer uniquement la boîte qui reçoit
 * les mails sans toucher au site, définir `LEADS_EMAIL` sur Vercel ou dans `.env.local`
 * (ex. `LEADS_EMAIL=toi@gmail.com`). Aucun fichier `supabase/functions/send-email` dans ce repo.
 *
 * Le **forwarding DNS / Routing Resend** (domaine → autre adresse) est indépendant du code :
 * il se configure dans le dashboard Resend si vous l’utilisez.
 */
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
