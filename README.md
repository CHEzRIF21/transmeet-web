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
pnpm dev
```

## Variables d'environnement

Voir `.env.example`. En production (Vercel) :

- `NEXT_PUBLIC_API_URL` : URL de l'API backend
- `NEXT_PUBLIC_APP_URL` : URL de l'application dashboard (login, inscription)

## Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer sur la branche `main`
