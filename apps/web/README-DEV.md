# Développement Transmeet — Un seul point d'entrée

## Lancement

Depuis la racine du projet :

```bash
cd TRANSMEET
pnpm dev
```

Ou avec npm :

```bash
npm run dev
```

Cela démarre **deux serveurs** en parallèle :
- **Site vitrine** (apps/web) : http://localhost:3000
- **Espace utilisateur** (transmeet-app) : http://localhost:3001 (en arrière-plan)

## Utilisation

**Tout se fait depuis** http://localhost:3000

- Page d'accueil, vitrine, BTP, contact…
- **Connexion** : http://localhost:3000/login
- **Inscription** : http://localhost:3000/register
- **Dashboard** : http://localhost:3000/dashboard (après connexion)
- **Comptes de test** : http://localhost:3000/seed-test-users

Les rewrites Next.js proxy les routes `/login`, `/register`, `/dashboard` et `/api` vers transmeet-app. L’URL reste sur le port 3000.

## Variables d'environnement

- **apps/web** : `.env.local` (optionnel, pour les formulaires)
- **transmeet-app** : `.env.local` avec `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
