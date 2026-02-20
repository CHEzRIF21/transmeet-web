# Alignement schéma Prisma / Spécification Domaines

Ce document décrit l’alignement du schéma Prisma avec la spec « Utilisateurs & Identité », « Flotte & Capacité », « Missions & Commerce », « Transactions & Opérations ».

## Domaine 1 — Utilisateurs & Identité

| Spec (table)     | Prisma (model)   | Alignement |
|------------------|------------------|------------|
| users            | User             | id, email, phone, password_hash→passwordHash, role, status, preferred_lang→preferredLang, created_at, last_login_at. En plus : updated_at, deleted_at (audit / soft delete). |
| companies        | Company          | type est un **enum** `CompanyType` (EXPEDITEUR \| TRANSPORTEUR \| NEGOCIANT). address en `@db.Text`. |
| user_documents   | UserDocument     | type est un **enum** `UserDocumentType` (ID_CARD \| PASSPORT \| PERMIS \| RCCM \| CARTE_GRISE). status = DocStatus (PENDING \| APPROVED \| REJECTED). |

## Domaine 2 — Flotte & Capacité

| Spec (table)     | Prisma (model)   | Alignement |
|------------------|------------------|------------|
| vehicles         | Vehicle          | Inchangé. type = VehicleType, status = VehicleStatus. |
| vehicle_docs     | VehicleDoc       | type = **enum** `VehicleDocType` (ASSURANCE \| VISITE_TECH \| CARTE_GRISE \| LAISSEZ_PASSER). status = **enum** `VehicleDocStatus` (VALID \| EXPIRING \| EXPIRED). Index sur (vehicleId, status). |

## Domaine 3 — Missions & Commerce

| Spec (table)         | Prisma (model)     | Alignement |
|----------------------|--------------------|------------|
| transport_requests   | TransportRequest   | special_notes en `@db.Text`. |
| missions             | Mission            | Relation optionnelle **linkedDeals** vers CommercialDeal (missions liées à des deals). |
| commercial_deals     | CommercialDeal     | **linkedMission** : relation optionnelle FK → Mission (linked_mission_id). Index sur linkedMissionId. |

## Domaine 4 — Transactions & Opérations

| Spec (table)         | Prisma (model)     | Alignement |
|----------------------|--------------------|------------|
| payments             | Payment            | Inchangé (method, gateway, status en enums). gateway_tx_id reste unique (idempotence). |
| customs_requirements | CustomsRequirement | notes en `@db.Text`. |
| customs_dossiers     | CustomsDossier     | Inchangé. |
| customs_documents    | CustomsDocument    | status = **enum** `CustomsDocStatus` (PENDING \| VALIDATED \| REJECTED). rejection_note en `@db.Text`. |
| messages             | Message            | content en `@db.Text`. room_id modélisé par missionId + dealId (pas de relation polymorphique). |
| notifications        | Notification       | channel = **enum** `NotificationChannel` (PUSH \| SMS \| EMAIL \| IN_APP). body en `@db.Text`. |
| reviews              | Review             | rating en `@db.SmallInt` (1–5). comment en `@db.Text`. |

## Nouveaux enums Prisma

- **CompanyType** : EXPEDITEUR, TRANSPORTEUR, NEGOCIANT  
- **UserDocumentType** : ID_CARD, PASSPORT, PERMIS, RCCM, CARTE_GRISE  
- **VehicleDocType** : ASSURANCE, VISITE_TECH, CARTE_GRISE, LAISSEZ_PASSER  
- **VehicleDocStatus** : VALID, EXPIRING, EXPIRED  
- **NotificationChannel** : PUSH, SMS, EMAIL, IN_APP  
- **CustomsDocStatus** : PENDING, VALIDATED, REJECTED (pour customs_documents uniquement)

## Appliquer les changements en BDD

Avec `.env` configuré (DATABASE_URL, DIRECT_URL) :

```bash
pnpm db:generate
pnpm db:push
# ou pour une migration versionnée :
pnpm db:migrate
```

Nom suggéré pour la migration : `align_schema_with_spec_domains`.
