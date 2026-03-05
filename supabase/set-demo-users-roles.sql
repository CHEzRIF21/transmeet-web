-- ============================================================
-- Définir les rôles des utilisateurs démo (à exécuter APRÈS création)
-- ============================================================
-- Exécutez ce script dans Supabase SQL Editor après avoir créé
-- les 3 utilisateurs dans Dashboard → Authentication → Users.
-- ============================================================

UPDATE public.profiles SET role = 'expediteur', full_name = 'Expéditeur Demo'
  WHERE id = (SELECT id FROM auth.users WHERE email = 'expediteur@transmeet.demo');

UPDATE public.profiles SET role = 'transporteur', full_name = 'Transporteur Demo'
  WHERE id = (SELECT id FROM auth.users WHERE email = 'transporteur@transmeet.demo');

UPDATE public.profiles SET role = 'admin', full_name = 'Admin Demo'
  WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@transmeet.demo');
