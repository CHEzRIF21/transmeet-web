-- ============================================================
-- Recréation de la table profiles pour Supabase Auth
-- ============================================================
-- À exécuter dans Supabase: SQL Editor → New query → Coller et Run
--
-- Cause de l'erreur "Database error creating new user" :
-- La migration Prisma a supprimé public.profiles, mais Supabase a
-- un trigger sur auth.users qui tente d'insérer dans profiles.
-- ============================================================

-- 1. Supprimer l'ancien trigger et la fonction (s'ils existent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Créer la table profiles (compatible avec auth.ts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'expediteur',
  full_name text,
  company_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- 3. Activer RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies : chaque utilisateur peut lire/modifier son propre profil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- L'insert est fait par le trigger (SECURITY DEFINER = privilèges postgres, bypass RLS)

-- 5. Fonction trigger : crée un profil minimal à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'role', 'expediteur')
  );
  RETURN new;
END;
$$;

-- 6. Trigger sur auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. Après avoir créé les 3 utilisateurs dans Dashboard → Authentication → Users,
--    exécutez ces requêtes pour définir les rôles :
--
-- UPDATE public.profiles SET role = 'transporteur', full_name = 'Transporteur Demo'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'transporteur@transmeet.demo');
--
-- UPDATE public.profiles SET role = 'admin', full_name = 'Admin Demo'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@transmeet.demo');
--
-- UPDATE public.profiles SET full_name = 'Expéditeur Demo'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'expediteur@transmeet.demo');
