# Correction erreur de déploiement Vercel — ERR_PNPM_OUTDATED_LOCKFILE

## Erreur

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json

specifiers in the lockfile ({"turbo":"^2.3.0"}) don't match specs in package.json ({"next":"14.2.18","turbo":"^2.3.0"})
```

**Cause :** Le `package.json` racine contient `next` (ajouté pour la détection Next.js) mais le lockfile n’a pas été régénéré, ce qui provoque l’erreur en CI (frozen-lockfile par défaut).

---

## Solution (2 étapes)

### Étape 1 : Configurer le Root Directory dans Vercel

1. Va sur **Vercel** → ton projet → **Settings** → **General**
2. Dans **Root Directory**, saisit : `apps/web`
3. Sauvegarde

Ainsi :
- Vercel détecte Next.js via `apps/web/package.json`
- Le build utilise `apps/web` comme projet
- Le `package.json` racine n’a plus besoin de contenir `next`

### Étape 2 : Retirer `next` du `package.json` racine (si présent)

Si ton dépôt GitHub a encore `next` dans le `package.json` racine, retire-le pour rester aligné avec le lockfile :

```json
// package.json (racine) — ne doit contenir que :
"devDependencies": {
  "turbo": "^2.3.0"
}
```

Puis :

```bash
pnpm install   # régénère le lockfile si besoin
git add package.json pnpm-lock.yaml
git commit -m "fix: remove next from root package.json for Vercel deploy"
git push
```

---

## Vérification

Après ces changements, un nouveau déploiement doit :

1. Installer les dépendances sans erreur de lockfile
2. Détecter Next.js via `apps/web/package.json`
3. Builder avec succès
