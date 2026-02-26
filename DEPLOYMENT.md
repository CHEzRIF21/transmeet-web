# Déploiement Transmeet Web

## 1. Créer le dépôt GitHub

1. Allez sur https://github.com/new
2. Nom du dépôt : **transmeet-web**
3. Visibilité : Public ou Private selon vos besoins
4. **Ne cochez pas** "Add a README" (le projet existe déjà)
5. Cliquez sur "Create repository"

## 2. Pousser le code

```bash
cd c:\Users\Mustafa\Desktop\transmeet-web

# Ajouter le remote (remplacez CHEzRIF21 par votre username si différent)
git remote add origin https://github.com/CHEzRIF21/transmeet-web.git

# Renommer la branche en main si nécessaire
git branch -M main

# Push
git push -u origin main
```

## 3. Déployer sur Vercel

### transmeet-web (site vitrine)

1. Connectez-vous sur https://vercel.com
2. **New Project** → Importez le dépôt **transmeet-web**
3. Framework : Next.js (détecté automatiquement)
4. **Variables d'environnement** :
   - `NEXT_PUBLIC_API_URL` : URL de votre API (ex: `https://api.transmeet.com` ou `https://votre-api.railway.app`)
   - `NEXT_PUBLIC_APP_URL` : URL de l'app dashboard (ex: `https://transmeet-app.vercel.app` ou votre domaine)
5. Deploy

### TRANSMEET (transmeet-app — dashboard + API)

1. **New Project** → Importez le dépôt **TRANSMEET**
2. **Root Directory** : laisser vide (racine)
3. **Build Command** : `pnpm --filter web build` (déjà dans vercel.json)
4. **Variables d'environnement** :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. L'API (apps/api) se déploie séparément sur Railway ou autre hébergeur Node.js

## 4. Secrets GitHub (CI)

Pour le dépôt **TRANSMEET**, configurez dans Settings → Secrets and variables → Actions :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Pour **transmeet-web**, optionnel (CI utilise des valeurs par défaut pour le build) :

- `NEXT_PUBLIC_API_URL` (variable, pas secret)
- `NEXT_PUBLIC_APP_URL` (variable, pas secret)
