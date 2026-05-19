-- =============================================================================
-- Supabase — policies RLS pour public.leads (à exécuter dans SQL Editor)
-- =============================================================================
-- Contexte : la migration Prisma `20260304170000_enable_rls_on_all_tables`
-- active RLS sans policy → PostgREST refuse les accès non autorisés.
--
-- Le route handler Next `/api/leads` utilise en priorité SUPABASE_SERVICE_ROLE_KEY
-- (PostgREST) : le rôle service_role contourne RLS. Si vous voyez encore des
-- erreurs côté anon (ex. autre client ou clé manquante en prod), ces policies
-- autorisent l’INSERT public et le SELECT pour les utilisateurs connectés.
--
-- Idempotent : DROP POLICY IF EXISTS puis CREATE.
-- =============================================================================

-- 1) État actuel
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'leads';

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2) INSERT — formulaires / landing (rôle anon)
DROP POLICY IF EXISTS "allow_public_insert_leads" ON public.leads;
CREATE POLICY "allow_public_insert_leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- 3) SELECT — utilisateurs authentifiés (affiner si besoin : rôle admin uniquement)
DROP POLICY IF EXISTS "allow_authenticated_select_leads" ON public.leads;
CREATE POLICY "allow_authenticated_select_leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- 4) Vérification
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'leads'
ORDER BY policyname;
