# Déploiement Vercel — transmeet-web (Landing)

Ce dossier contient la **landing page** Transmeet affichée sur localhost:3000.

## Configuration Vercel

1. **New Project** → Importez le dépôt (TRANSMEET ou transmeet-web)
2. **Root Directory** : `transmeet-web` (obligatoire si monorepo)
3. **Framework Preset** : Next.js (détecté automatiquement)
4. **Build Command** : `pnpm run build` (ou laisser vide pour auto)
5. **Install Command** : `pnpm install` (ou laisser vide pour auto)

## Variables d'environnement (optionnel)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | URL du dashboard (ex: https://app.transmeet.com) |
| `NEXT_PUBLIC_API_URL` | URL de l'API pour formulaires (ex: https://api.transmeet.com) |

## Commandes locales

```bash
cd transmeet-web
pnpm install
pnpm run dev    # http://localhost:3000
pnpm run build  # Vérifier le build avant déploiement
```

## Structure déployée

- `/` — Page d'accueil (Hero, About, Expéditeurs, Transporteurs, BTP, Services, Témoignages, Contact)
- `/qui-sommes-nous` — À propos
- `/expediteurs` — Page expéditeurs
- `/transporteurs` — Page transporteurs
- `/btp` — Page BTP
- `/contact` — Formulaire de contact
- `/mentions-legales`, `/politique-confidentialite`, `/cookies` — Pages légales
