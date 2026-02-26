# Transmit — Marketplace Logistique

Monorepo Turborepo : frontend Next.js + backend Fastify.

## Prérequis

- **Node.js 20+**
- **pnpm** (gestionnaire de paquets du projet)

Si pnpm n’est pas installé :

```bash
corepack enable
corepack prepare pnpm@9.14.2 --activate
```

Ou : `npm install -g pnpm`

## Installation

```bash
pnpm install
```

## Commandes

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le frontend (3000) et l’API (4000) |
| `pnpm dev:web` | Lance uniquement le frontend (http://localhost:3000) |
| `pnpm dev:api` | Lance uniquement l’API (http://localhost:4000) |
| `pnpm build` | Build tous les packages |
| `pnpm lint` | Lint tous les packages |
| `pnpm db:generate` | Génère le client Prisma (api) |
| `pnpm db:push` | Applique le schéma Prisma à la BDD |
| `pnpm db:studio` | Ouvre Prisma Studio |

## Premier lancement

1. **Installer les dépendances** (obligatoire avant `build` ou `dev`) :

   ```bash
   pnpm install
   ```

2. **Lancer l’app web seule** :

   ```bash
   pnpm dev:web
   ```

   Puis ouvrir http://localhost:3000

3. **Lancer tout (web + API)** :

   ```bash
   pnpm dev
   ```

4. **Build** :

   ```bash
   pnpm build
   ```

> **Important :** Ce projet utilise **pnpm** (pas npm). Après `pnpm install`, les commandes `pnpm build`, `pnpm dev`, etc. fonctionnent. Avec `npm run build` sans avoir fait `pnpm install` (ou sans `node_modules`), la commande `turbo` ne sera pas trouvée.
# TRANSMEET
