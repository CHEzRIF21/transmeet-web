# Transmeet

Projet simplifié — seul **transmeet-web** est conservé.

## Structure actuelle

```
TRANSMEET/
├── transmeet-web/     # Application Next.js (projet principal)
├── TRANSMEET-archive-20260226.zip   # Archive de récupération
└── README.md
```

## Utilisation

```bash
cd transmeet-web
pnpm install
pnpm dev
```

## Récupération de l'ancien projet

L'archive `TRANSMEET-archive-20260226.zip` contient :
- apps/ (web, api)
- packages/
- transmeet-app/
- docs/
- .github/
- .git/ (historique)
- Fichiers de config monorepo

Pour restaurer : extraire l'archive dans un autre dossier.  
**Note :** `node_modules` n'est pas inclus (exécuter `pnpm install` après restauration).
