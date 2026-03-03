# Déploiement Vercel — Transmeet

Ce monorepo contient l'application Next.js dans `apps/web`. Pour que le déploiement fonctionne sur Vercel, **Root Directory** doit être configuré correctement.

## Configuration requise

1. **Vercel Dashboard** → votre projet → **Settings** → **General**
2. Définir **Root Directory** à : `apps/web`
3. **Build Command** : `pnpm run build` (ou laisser vide pour utiliser le défaut)
4. **Install Command** : laisser vide pour que Vercel exécute `pnpm install` depuis la racine du dépôt

## Variables d'environnement

Ajouter dans **Settings** → **Environment Variables** :

- `NEXT_PUBLIC_SUPABASE_URL` — URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clé anonyme Supabase

Optionnel (pour les données du dashboard) :

- `DATABASE_URL` — Chaîne de connexion PostgreSQL (même que l'API si partage de la base)

## Pourquoi Root Directory = apps/web ?

Vercel cherche le dossier `.next` à la racine du projet. Dans ce monorepo, le build Next.js produit `apps/web/.next`. En définissant Root Directory sur `apps/web`, Vercel considère ce dossier comme la racine du projet et trouve correctement `.next`.
