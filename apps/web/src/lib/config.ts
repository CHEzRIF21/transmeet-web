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
