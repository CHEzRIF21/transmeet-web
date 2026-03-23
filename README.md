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

## Build (monorepo à la racine `TRANSMEET/`)

Depuis la racine du dépôt :

```bash
pnpm install
pnpm run build
```

Le script `build` lance d’abord `prisma generate` pour l’app **web** (avec reprises automatiques sur Windows), puis `turbo build`. Cela limite les erreurs **`EPERM`** sur `query_engine-windows.dll.node` causées par l’antivirus ou l’exécution parallèle.

- Build **web** seul : `pnpm --filter web run build` suppose que le client Prisma est déjà généré (`pnpm run prisma:generate` à la racine).
- Variable optionnelle : `PRISMA_GENERATE_RETRIES=8` pour augmenter le nombre de tentatives.
