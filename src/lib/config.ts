/**
 * URL de l'application dashboard (transmeet-app).
 * En prod : configurer NEXT_PUBLIC_APP_URL sur Vercel.
 */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const APP_ROUTES = {
  login: () => (APP_URL ? `${APP_URL}/login` : "/login"),
  register: (role?: "expediteur" | "transporteur") => {
    const base = APP_URL ? `${APP_URL}/register` : "/register";
    return role ? `${base}?role=${role}` : base;
  },
  dashboard: () => (APP_URL ? `${APP_URL}/dashboard` : "/dashboard"),
} as const;
