-- À exécuter dans le SQL Editor du projet Supabase TRANSMIT (trans-meet),
-- pas un autre projet. Le MCP Cursor peut être relié à une autre base : vérifier l’URL du projet.
--
-- 1) Schéma Prisma : table public.leads + enum "LeadType"
-- 2) Les migrations officielles sont dans apps/api/prisma/migrations — lancer sur le serveur API :
--    pnpm --filter api exec prisma migrate deploy
--
-- Ce script vérifie seulement la présence de la table et des colonnes attendues.

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'leads';

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'leads'
ORDER BY ordinal_position;

-- RLS : si des erreurs PostgREST/anon persistent, appliquer aussi
-- scripts/sql/supabase_leads_rls_policies.sql dans le SQL Editor Supabase.
-- La clé service_role contourne RLS pour les INSERT serveur (SUPABASE_SERVICE_ROLE_KEY).

-- Migration `lead_name_email_optional` (colonnes name/email nullable) : appliquée sur Supabase via MCP si besoin.
-- Pour aligner l’historique Prisma local avec la base :
--   cd apps/api && pnpm exec prisma migrate resolve --applied 20260309000000_lead_name_email_optional
-- (avec DATABASE_URL pointant vers ce projet Supabase)

-- Edge Functions Supabase : non requises pour les formulaires — le flux officiel est POST /api/leads (Next.js sur Vercel).
