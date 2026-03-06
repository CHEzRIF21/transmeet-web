---
name: wave_transition_header_footer
overview: Ajouter des transitions en courbe (SVG wave) avec bande or entre le header bleu et le contenu blanc, et entre le contenu et le footer bleu, en s'inspirant du design de reference fourni.
todos:
  - id: header-wave
    content: Ajouter la vague SVG courbe avec bande or sous le header
    status: completed
  - id: footer-redesign
    content: Refondre le footer en fond bleu avec vague SVG courbe et bande or au-dessus
    status: completed
  - id: layout-spacing
    content: Ajuster les espacements dans le layout marketing pour les vagues
    status: completed
isProject: false
---

# Transitions courbes Header/Footer avec bande or

## Image de reference

Le design montre une transition courbe concave (comme un arc) entre les zones blanches et les zones bleues, separee par une fine bande or `#e0a842`. Cela donne un effet premium et organique.

## Fichiers concernes

- `[apps/web/src/components/layout/PublicHeader.tsx](apps/web/src/components/layout/PublicHeader.tsx)` -- ajout de la vague SVG sous le header
- `[apps/web/src/components/layout/PublicFooter.tsx](apps/web/src/components/layout/PublicFooter.tsx)` -- refonte fond bleu + vague SVG au-dessus
- `[apps/web/src/app/(marketing)/layout.tsx](apps/web/src/app/(marketing)/layout.tsx)` -- ajustement pour les vagues

## 1. Vague sous le header (bleu vers blanc)

Ajouter un SVG wave en bas du `<header>`, positionne en absolu sous la barre de navigation. La forme est un arc concave (creux vers le bas) avec :

- Un remplissage `#012767` (meme couleur que le header) pour la partie superieure de l'arc
- Une fine bande `#e0a842` (or) de 3-4px d'epaisseur juste en dessous de l'arc
- Hauteur totale de la zone wave : environ 40-50px

Le SVG sera positionne avec `absolute -bottom-[48px] left-0 right-0 z-30` pour deborder sous le header. Le `<main>` aura un `pt-12` pour compenser.

## 2. Footer redesign (fond bleu + vague au-dessus)

### Vague au-dessus du footer

Un SVG wave inverse (arc convexe vers le haut) place en `absolute -top-[48px]` du footer :

- Arc blanc/fond de page qui fait la transition vers le bleu du footer
- Fine bande or `#e0a842` au sommet de l'arc

### Footer fond bleu

Le footer actuel `bg-muted/30` sera remplace par `bg-gradient-to-b from-[#012767] to-[#021e4a]` :

- Tous les textes passent en blanc (`text-white`, `text-white/70`)
- Le titre de navigation en `text-[#e0a842]`
- Les liens en `text-white/70 hover:text-white`
- Le bouton "Acceder a l'application" en `variant="accent"`
- Le logo garde mais adapte au fond sombre
- Le copyright en `text-white/50` sur fond bleu aussi

## 3. Layout marketing

Dans `layout.tsx`, ajouter du padding top au `<main>` pour compenser la vague qui deborde du header, et un `relative` sur le footer pour le SVG positionne en absolu.

## Detail du SVG wave

```html
<!-- Arc concave (sous le header) -->
<svg viewBox="0 0 1440 48" preserveAspectRatio="none">
  <path d="M0,0 L0,24 Q720,48 1440,24 L1440,0 Z" fill="#012767"/>
  <path d="M0,24 Q720,48 1440,24" stroke="#e0a842" strokeWidth="3" fill="none"/>
</svg>

<!-- Arc convexe (au-dessus du footer) -->
<svg viewBox="0 0 1440 48" preserveAspectRatio="none">
  <path d="M0,48 L0,24 Q720,0 1440,24 L1440,48 Z" fill="#012767"/>
  <path d="M0,24 Q720,0 1440,24" stroke="#e0a842" strokeWidth="3" fill="none"/>
</svg>
```

