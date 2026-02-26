# Déploiement Vercel — TRANSMEET

## Projet TRANSMEET (transmeet-app)

Ce dépôt contient :
- **apps/web** : Dashboard Next.js (auth, missions, etc.)
- **apps/api** : API Fastify (à déployer sur Railway)

### Configuration Vercel

1. **New Project** → Importez **TRANSMEET** (CHEzRIF21/TRANSMEET)
2. **Root Directory** : laisser vide
3. **Build Command** : `pnpm --filter web build` (déjà dans vercel.json)
4. **Install Command** : `pnpm install`
5. **Variables d'environnement** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Secrets GitHub (CI)

Settings → Secrets and variables → Actions :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### API (apps/api)

Déployer séparément sur **Railway** ou autre hébergeur Node.js avec PostgreSQL.
