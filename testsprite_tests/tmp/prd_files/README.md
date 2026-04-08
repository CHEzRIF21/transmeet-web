# Transmeet Web — Site vitrine

Site vitrine de **Transmeet**, plateforme logistique B2B pour l'Afrique de l'Ouest.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Développement

```bash
pnpm install
cp .env.example .env.local   # Connexion/S'inscrire → transmeet-app (localhost:3001)
pnpm dev
```

Les boutons **Connexion** et **S'inscrire** redirigent vers transmeet-app. Après connexion, l'utilisateur accède à l'espace de travail.

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL de transmeet-app (login, inscription, dashboard). En dev : `http://localhost:3001` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend (formulaires contact/BTP) |

## Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer sur la branche `main`
