# Guide des images — Transmeet

Ce document indique où placer ou remplacer les images dans l'application.

## Structure du dossier `public/images/`

```
transmeet-app/public/images/
├── logo.png          ✅ Logo Transmeet (Navbar + Footer)
├── hero.jpg          📍 Image de fond Hero (optionnel)
├── services/         📍 Images pour les cartes Services (optionnel)
│   ├── transport-routier.jpg
│   ├── transport-btp.jpg
│   ├── douanes.jpg
│   └── logistique.jpg
└── testimonials/     📍 Photos des témoignages (optionnel)
    ├── amadou.jpg
    ├── fatou.jpg
    └── ibrahim.jpg
```

---

## Emplacements et placeholders

### 1. Logo (déjà en place)
- **Fichier** : `public/images/logo.png`
- **Utilisé dans** : Navbar, Footer
- **Format recommandé** : PNG avec fond transparent, largeur ~280px

### 2. Hero — Image de fond
- **Fichier actuel** : URL Unsplash (externe)
- **Fichier à remplacer** : `public/images/hero.jpg`
- **Composant** : `src/components/home/Hero.tsx`
- **Ligne à modifier** : remplacer `HERO_IMAGE` par `/images/hero.jpg`
- **Format recommandé** : JPG/WebP, 1920×1080 ou plus, thème camions/logistique

```ts
// Dans Hero.tsx, remplacer :
const HERO_IMAGE = "/images/hero.jpg";
```

### 3. Services — Images des cartes (optionnel)
- **Dossier** : `public/images/services/`
- **Composant** : `src/components/home/Services.tsx`
- Actuellement : icônes Lucide uniquement. Pour ajouter des images :
  - Créer `transport-routier.jpg`, `transport-btp.jpg`, etc.
  - Modifier `FeatureCard` ou `Services.tsx` pour accepter une prop `imageSrc`

### 4. Témoignages — Photos des clients (optionnel)
- **Dossier** : `public/images/testimonials/`
- **Composant** : `src/components/home/Testimonials.tsx`
- Pour ajouter des avatars : ajouter une prop `avatar` aux témoignages et utiliser `next/image`

### 5. Favicon
- **Fichier** : `public/favicon.ico` ou `src/app/icon.png`
- **Action** : Remplacer par une version carrée du logo (32×32 ou 48×48)

---

## Récapitulatif des actions

| Priorité | Action | Fichier |
|----------|--------|---------|
| ✅ Fait | Logo ajouté | `public/images/logo.png` |
| Haute | Remplacer image Hero par la vôtre | `public/images/hero.jpg` puis modifier `Hero.tsx` |
| Basse | Ajouter favicon | `public/favicon.ico` |
| Optionnel | Images Services | `public/images/services/*.jpg` |
| Optionnel | Photos témoignages | `public/images/testimonials/*.jpg` |

---

## Bonnes pratiques

- **Formats** : WebP ou JPG pour les photos, PNG pour le logo
- **Tailles** : Utiliser `next/image` (déjà en place) pour l'optimisation automatique
- **Noms** : minuscules, tirets (ex. `hero-background.jpg`)
