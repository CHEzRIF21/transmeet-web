# Correction du déploiement Vercel — ENOENT page_client-reference-manifest.js

## Erreur « No Next.js version detected »

Si le build affiche :
`Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".`

**Cause :** Vercel build à la racine du monorepo, où le `package.json` racine ne contient pas `next` (il est dans `apps/web`).

**Correctifs appliqués :**
- Un `vercel.json` à la racine définit `buildCommand: "pnpm --filter web build"`, `installCommand: "pnpm install"` et `framework: "nextjs"`.
- Le `package.json` racine inclut `next` en `devDependencies` pour que Vercel détecte le framework.

**Si l’erreur persiste :** dans Vercel → Project Settings → General → **Root Directory**, renseigner `apps/web` (puis redéployer). Dans ce cas vous pouvez retirer `next` du `package.json` racine si vous préférez.

---

## ⚠️ Important : structure du dépôt

Le build Vercel indique une structure **monorepo** (`apps/web`, Turbo, `pnpm --filter web`), alors que votre dépôt local contient **transmeet-web** (sans `apps/`).

**Deux cas possibles :**

1. **Vercel pointe vers la racine** et s’attend à un monorepo → le build cherche `apps/web` qui n’existe pas ou a une structure différente.
2. **Vous voulez déployer transmeet-web** → configurez Vercel avec **Root Directory** = `transmeet-web`.

Si vous déployez **transmeet-web** uniquement, définissez dans Vercel :
- **Root Directory** : `transmeet-web`
- **Build Command** : `pnpm run build` (ou vide)
- **Install Command** : `pnpm install` (ou vide)

---

## Diagnostic

L'erreur survient lors de l'étape **"Collecting build traces"** après un build Next.js réussi :

```
Error: ENOENT: no such file or directory, lstat '/vercel/path0/apps/web/.next/server/app/(dashboard)/page_client-reference-manifest.js'
```

### Cause probable

Le groupe de routes `(dashboard)` contient une `page.tsx` qui fait uniquement un `redirect()` côté serveur. Dans ce cas, Next.js ne génère pas de manifest client (`page_client-reference-manifest.js`), mais l’étape de trace s’attend à le trouver.

---

## Solutions (à tester dans l’ordre)

### Solution 1 : Déplacer le redirect dans le layout (recommandé)

Si `apps/web/app/(dashboard)/page.tsx` ressemble à ceci :

```tsx
import { redirect } from 'next/navigation'
export default function DashboardPage() {
  redirect('/admin') // ou /login, etc.
}
```

**Correction :** supprimer ce fichier et gérer le redirect dans le layout.

1. **Supprimer** `apps/web/app/(dashboard)/page.tsx`

2. **Modifier** `apps/web/app/(dashboard)/layout.tsx` pour ajouter le redirect :

```tsx
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Si vous voulez rediriger la racine (dashboard) vers une sous-route :
  // Faire le redirect dans le layout n'est pas idéal car il s'applique à toutes les pages
  // Mieux : garder une page avec un composant client minimal (voir Solution 2)
  return <>{children}</>
}
```

3. **Si la route `/` (dashboard) doit rediriger** : créer une page qui utilise un composant client pour la redirection :

```tsx
// apps/web/app/(dashboard)/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardIndexPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin') // ou /expediteur, /transporteur, etc.
  }, [router])
  return <div className="flex min-h-screen items-center justify-center">Chargement...</div>
}
```

### Solution 2 : Page client avec redirect (alternative)

Si vous gardez une page dans `(dashboard)`, assurez-vous qu’elle contient au moins un composant client pour que le manifest soit généré :

```tsx
// apps/web/app/(dashboard)/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin')
  }, [router])
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirection...</p>
    </div>
  )
}
```

### Solution 3 : Configuration Next.js

Dans `apps/web/next.config.js` (ou `next.config.mjs`), ajouter :

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... config existante
  experimental: {
    // Peut aider à résoudre certains problèmes de trace
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Ne pas utiliser output: 'standalone' sur Vercel (géré automatiquement)
}

module.exports = nextConfig
```

### Solution 4 : Mise à jour de Next.js

Le bug est connu sur certaines versions. Essayez de passer à la dernière version 14.x :

```bash
pnpm add next@14.2.19 -F web
# ou
pnpm add next@latest -F web
```

### Solution 5 : Configuration Turbo (monorepo)

Si vous utilisez Turborepo, vérifiez que `turbo.json` inclut correctement les outputs :

```json
{
  "tasks": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

---

## Vérifier la configuration Vercel

Le build log indique `apps/web` et `pnpm --filter web`. Donc :

- **Root Directory** : la racine du projet (monorepo)
- **Build Command** : `pnpm --filter web build` ou `cd apps/web && pnpm build`

Si vous souhaitez déployer uniquement **transmeet-web** (sans monorepo) :

1. **Root Directory** : `transmeet-web`
2. **Build Command** : `pnpm run build` (ou laisser vide)
3. **Install Command** : `pnpm install` (ou laisser vide)

---

## Vérification locale

Avant de pousser :

```bash
cd apps/web  # ou transmeet-web selon votre structure
rm -rf .next
pnpm build
```

Si le build passe localement mais échoue sur Vercel, privilégier les solutions 1 ou 2.
