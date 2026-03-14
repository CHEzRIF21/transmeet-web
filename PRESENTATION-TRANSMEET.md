# Transmeet — Présentation détaillée du projet
## Document pour génération de présentation (Gamma, etc.)

---

## 📋 SLIDE 1 — Titre et accroche

**Transmeet**  
*Votre partenaire en transport et logistique lourde*

Plateforme digitale de mise en relation entre expéditeurs et transporteurs professionnels en Afrique de l'Ouest.

---

## 📋 SLIDE 2 — Le problème / La opportunité

- **Marché fragmenté** : difficulté pour les expéditeurs de trouver des transporteurs fiables et qualifiés
- **Manque de visibilité** : suivi imprécis des livraisons, traçabilité limitée
- **Formalités complexes** : douanes, documents, délais peu digitalisés
- **Relations commerciales non sécurisées** : paiements directs, confiance difficile à établir
- **Marché BTP sous-servi** : mobilisation d'engins (pelleteuses, bulldozers, béton) peu structurée

---

## 📋 SLIDE 3 — La solution Transmeet

**Une marketplace logistique B2B** qui connecte :

- **Expéditeurs** : entreprises qui ont besoin de transporter des marchandises ou de louer des engins BTP
- **Transporteurs** : professionnels avec flotte de véhicules (camions, citernes, frigos, engins de chantier)

**Zone géographique** : Bénin, Togo, hinterland UEMOA/CEDEAO (Afrique de l'Ouest)

---

## 📋 SLIDE 4 — Valeur ajoutée (pourquoi choisir Transmeet)

| Avantage | Description |
|----------|-------------|
| **Transporteurs vérifiés** | Professionnels identifiés et qualifiés pour des prestations fiables |
| **Gain de temps** | Mise en relation rapide, suivi en temps réel et messagerie intégrée |
| **Sécurité** | Documents centralisés, traçabilité et bonnes pratiques logistiques |
| **Prix compétitifs** | Comparez les offres et choisissez le meilleur rapport qualité-prix |
| **Support dédié** | Une équipe à votre écoute pour vous accompagner au quotidien |

---

## 📋 SLIDE 5 — Nos valeurs

- **Éthique** : Transparence totale avec les clients, instauration d'un climat de confiance nécessaire à la bonne marche des relations
- **Excellence** : Engagement à l'excellence dans l'exécution des services, normes élevées pour la qualité, les performances et la satisfaction client
- **Innovation** : Mettre la technologie au service de la satisfaction client, développer des outils digitaux adaptés aux réalités du terrain en Afrique de l'Ouest

---

## 📋 SLIDE 6 — Expéditeurs : "Commander un camion"

**Proposition de valeur** :  
Expéditeurs, profitez d'une communauté de transporteurs fiables et rigoureux pour vos besoins en transport.

**Processus** :
1. Remplir un formulaire décrivant le besoin (origine, destination, type de marchandise, poids, volumes)
2. L'équipe Transmeet recontacte rapidement avec une proposition adaptée
3. Comparaison des offres de transporteurs
4. Suivi en temps réel (tracking GPS) dès la mission lancée

---

## 📋 SLIDE 7 — Transporteurs : "Référencer votre camion"

**Proposition de valeur** :  
Boostez votre activité et augmentez vos revenus avec Transmeet.

**Bénéfices** :
- Missions récurrentes adaptées à votre flotte
- Visibilité régionale sur les corridors stratégiques
- Support logistique et administratif
- Sécurisation de la relation commerciale (paiements sécurisés)
- Accès à des clients fiables

---

## 📋 SLIDE 8 — BTP & grands projets

**Segment spécialisé** : Engins BTP et transport pour projets structurants

**Types d'engins** :
- Pelleteuse (terrassement & excavation)
- Bulldozer (décapage & nivellement)
- Compacteur (compactage des sols)
- Camion toupie (transport de béton)
- Chariot élévateur (manutention de charges)
- Flotte BTP (mobilisation lourde)

**Approche** : Formulaire de devis dédié pour décrire le projet, les engins nécessaires et le planning.

---

## 📋 SLIDE 9 — Types de véhicules

Transmeet couvre l'ensemble des besoins logistiques :

| Type | Usage principal |
|------|-----------------|
| **Conteneur** | Marchandises conteneurisées |
| **Plateau** | Charges volumineuses |
| **Citerne** | Liquides (carburant, produits chimiques) |
| **Frigo** | Denrées alimentaires, produits frais |
| **Benne** | Granulats, matériaux |
| **Marchandise** | General cargo |
| **Bâché** | Marchandises diverses |

---

## 📋 SLIDE 10 — Mission et vision

**Mission** :  
Fournir des solutions logistiques personnalisées alliant efficacité opérationnelle, sécurité, transparence et conformité réglementaire.

**Ce que nous sommes** :  
Une plateforme logistique dédiée aux projets ambitieux. Nous combinons expertise terrain et innovation technologique pour offrir des solutions fiables, structurées et adaptées aux exigences des professionnels.

**Suivi en temps réel** :  
Visibilité complète sur les opérations, renforcement de la sécurité, maîtrise des délais et transparence.

---

## 📋 SLIDE 11 — Fonctionnalités techniques (plateforme)

- **Demandes de transport** : Création, publication, filtrage par origine/destination/dates
- **Offres transporteurs** : Proposition de prix, véhicule, disponibilité → acceptation par l'expéditeur
- **Missions** : Cycle complet ASSIGNED → LOADING → IN_TRANSIT → AT_CUSTOMS → DELIVERED
- **Tracking GPS** : Positions en temps réel (latitude, longitude, vitesse, cap)
- **Messagerie** : Conversations par mission entre expéditeur et transporteur
- **Paiements** : Historique, reçus PDF, export CSV (structure CinetPay/Stripe/Wave)
- **Douanes** : Workflow documents (CustomsDossier, CustomsDocument)
- **Réviews** : Notation 1–5 après livraison
- **KYC** : Vérification des documents (ID, passeport, RCCM, etc.)
- **Admin** : Gestion utilisateurs, KYC, paramètres, statistiques

---

## 📋 SLIDE 12 — Stack technique (synthèse)

| Couche | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind, shadcn/ui, TanStack Query, Zustand, Leaflet, Framer Motion |
| **Backend** | Fastify, Prisma, PostgreSQL (Supabase), Zod, BullMQ, Pino |
| **Auth** | Supabase Auth (email, OTP, JWT) |
| **Stockage** | Supabase Storage (presigned URLs) |
| **Infra** | Vercel (frontend), Railway (API), PostgreSQL Supabase |

**Monorepo** : pnpm + Turborepo (`apps/web`, `apps/api`, `packages/types`, `packages/validations`)

---

## 📋 SLIDE 13 — Sécurité & conformité

- Authentification JWT via Supabase
- Validation des entrées (Zod) sur toutes les routes
- Rate limiting sur les endpoints publics
- Uploads sécurisés (presigned URLs, pas de proxy)
- Gestion des rôles : EXPEDITEUR, TRANSPORTEUR, ADMIN, DOUANIER
- Montants en XOF (Franc CFA) en centimes (integer)
- Modèle escrow prévu pour les paiements

---

## 📋 SLIDE 14 — Couverture géographique

**Zone principale** : Bénin — Togo — Afrique de l'Ouest

- Corridors stratégiques UEMOA / CEDEAO
- Langues : Français (principal), Anglais (secondaire)
- Mobile-first : design adapté aux connexions limitées
- PWA : mode hors-ligne pour données critiques
- Contact : WhatsApp prioritaire (réponse rapide)

---

## 📋 SLIDE 15 — Contact & accompagnement

**Un projet logistique ? Parlons-en.**

Nous accompagnons expéditeurs et transporteurs dans l'optimisation de leurs flux logistiques.

**Canaux** :
- **WhatsApp** : Réponse en quelques minutes (Bénin / Togo)
- **Téléphone** : Profil Transmeet
- **Facebook** : @transmeet
- **TikTok** : @transmeet_officiel
- **Formulaire** : Demande de devis en ligne

---

## 📋 SLIDE 16 — État du projet

| Domaine | Statut |
|---------|--------|
| Site vitrine + landing | ✅ Opérationnel |
| Inscription / Connexion | ✅ Opérationnel |
| Demandes de transport | ✅ Opérationnel |
| Offres & missions | ✅ Opérationnel |
| Tracking GPS | ✅ Opérationnel |
| Messagerie | ✅ Opérationnel |
| Réviews | ✅ Opérationnel |
| Paiements (structure) | 🔄 En place, intégration CinetPay/Stripe à finaliser |
| Douanes (workflow) | 🔄 Routes présentes, à compléter |
| Admin / KYC | ✅ Opérationnel |
| Leads / formulaires | ✅ Opérationnel |

---

## 📋 SLIDE 17 — Appel à l'action

**Pour les expéditeurs** : Commander un camion → [Formulaire expéditeurs]  
**Pour les transporteurs** : Référencer mon camion → [Rejoindre le réseau]  
**Pour les projets BTP** : Demande de devis engins → [Formulaire BTP]  
**Contact général** : Demander un devis / WhatsApp rapide

---

## Données complémentaires pour slides visuelles

### Chiffres clés (à adapter)
- Zone : Bénin, Togo, Afrique de l'Ouest
- Secteurs : Transport routier, BTP, denrées alimentaires
- Devise : XOF (Franc CFA)

### Identité visuelle
- Couleur principale : Bleu marine (#012767, #01306e, #021e4a)
- Couleur accent : Or (#e0a842)
- Polices : Inter, Plus Jakarta Sans

### Images disponibles (dans `/public/images/`)
- Logo Transmeet
- Camions sur la route
- Engins BTP (pelleteuse, bulldozer, compacteur, toupie, chariot, flotte)
- Expéditeurs, transporteurs
- Types de véhicules (conteneur, plateau, citerne, benne, frigo, marchandise)

---

*Document généré pour présentation Transmeet — Mars 2026*
