-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('EXPEDITEUR', 'TRANSPORTEUR', 'ADMIN', 'DOUANIER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('PLATEAU', 'CITERNE', 'FRIGO', 'BENNE', 'CONTENEUR', 'BACHE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'ON_MISSION', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'MATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('ASSIGNED', 'LOADING', 'IN_TRANSIT', 'AT_CUSTOMS', 'DELIVERED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('NEGOTIATING', 'AGREED', 'PAYMENT_PENDING', 'PAID', 'DELIVERED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MOBILE_MONEY', 'BANK_TRANSFER', 'CARD', 'ESCROW');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('CINETPAY', 'STRIPE', 'WAVE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD_ESCROW', 'RELEASED', 'REFUNDED', 'FAILED');

-- CreateEnum
CREATE TYPE "CustomsDossierStatus" AS ENUM ('INCOMPLETE', 'SUBMITTED', 'UNDER_REVIEW', 'CLEARED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'FILE', 'OFFER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "MessageRoomType" AS ENUM ('MISSION', 'DEAL', 'SUPPORT');

-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('EXPEDITEUR', 'TRANSPORTEUR', 'NEGOCIANT');

-- CreateEnum
CREATE TYPE "UserDocumentType" AS ENUM ('ID_CARD', 'PASSPORT', 'PERMIS', 'RCCM', 'CARTE_GRISE');

-- CreateEnum
CREATE TYPE "VehicleDocType" AS ENUM ('ASSURANCE', 'VISITE_TECH', 'CARTE_GRISE', 'LAISSEZ_PASSER');

-- CreateEnum
CREATE TYPE "VehicleDocStatus" AS ENUM ('VALID', 'EXPIRING', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('PUSH', 'SMS', 'EMAIL', 'IN_APP');

-- CreateEnum
CREATE TYPE "CustomsDocStatus" AS ENUM ('PENDING', 'VALIDATED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('EXPEDITEUR', 'TRANSPORTEUR', 'BTP', 'CONTACT');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'expediteur',
    "full_name" TEXT,
    "company_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ownerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "country" CHAR(3) NOT NULL,
    "taxId" TEXT,
    "address" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" "UserDocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" UUID,
    "reviewedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "companyId" UUID NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "capacityTons" DECIMAL(10,2) NOT NULL,
    "capacityM3" DECIMAL(10,2),
    "countryReg" CHAR(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "currentLat" DECIMAL(10,7),
    "currentLng" DECIMAL(10,7),
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_docs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vehicleId" UUID NOT NULL,
    "type" "VehicleDocType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "expiresAt" DATE,
    "status" "VehicleDocStatus" NOT NULL DEFAULT 'VALID',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "senderId" UUID NOT NULL,
    "originCity" TEXT NOT NULL,
    "originCountry" CHAR(3) NOT NULL,
    "destCity" TEXT NOT NULL,
    "destCountry" CHAR(3) NOT NULL,
    "goodsType" TEXT NOT NULL,
    "weightTons" DECIMAL(10,2) NOT NULL,
    "volumeM3" DECIMAL(10,2),
    "pickupDate" DATE NOT NULL,
    "deliveryDate" DATE,
    "proposedPrice" DECIMAL(15,0) NOT NULL,
    "currency" VARCHAR(5) NOT NULL DEFAULT 'XOF',
    "status" "RequestStatus" NOT NULL DEFAULT 'DRAFT',
    "specialNotes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "transport_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requestId" UUID NOT NULL,
    "carrierId" UUID NOT NULL,
    "vehicleId" UUID NOT NULL,
    "agreedPrice" DECIMAL(15,0) NOT NULL,
    "commissionRate" DECIMAL(5,4) NOT NULL DEFAULT 0.05,
    "status" "MissionStatus" NOT NULL DEFAULT 'ASSIGNED',
    "pickupConfirmedAt" TIMESTAMPTZ,
    "deliveryConfirmedAt" TIMESTAMPTZ,
    "trackingUpdates" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commercial_deals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "buyerId" UUID NOT NULL,
    "sellerId" UUID NOT NULL,
    "goodsType" TEXT NOT NULL,
    "quantityTons" DECIMAL(10,2) NOT NULL,
    "unitPrice" DECIMAL(15,0) NOT NULL,
    "totalAmount" DECIMAL(15,0) NOT NULL,
    "currency" VARCHAR(5) NOT NULL DEFAULT 'XOF',
    "status" "DealStatus" NOT NULL DEFAULT 'NEGOTIATING',
    "linkedMissionId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "commercial_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payerId" UUID NOT NULL,
    "payeeId" UUID NOT NULL,
    "missionId" UUID,
    "dealId" UUID,
    "amount" DECIMAL(15,0) NOT NULL,
    "commission" DECIMAL(15,0) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "gatewayTxId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "releasedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_requirements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "originCountry" CHAR(3) NOT NULL,
    "destCountry" CHAR(3) NOT NULL,
    "goodsCategory" TEXT NOT NULL,
    "requiredDocs" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "customs_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_dossiers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "missionId" UUID NOT NULL,
    "requirementId" UUID NOT NULL,
    "status" "CustomsDossierStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "blockedRelease" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMPTZ,
    "clearedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customs_dossiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customs_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dossierId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedBy" UUID NOT NULL,
    "status" "CustomsDocStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionNote" TEXT,
    "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customs_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "roomType" "MessageRoomType" NOT NULL,
    "senderId" UUID NOT NULL,
    "missionId" UUID,
    "dealId" UUID,
    "content" TEXT,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "fileUrl" TEXT,
    "readAt" TIMESTAMPTZ,
    "sentAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB,
    "readAt" TIMESTAMPTZ,
    "sentAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "missionId" UUID NOT NULL,
    "reviewerId" UUID NOT NULL,
    "revieweeId" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT,
    "tags" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "LeadType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "profiles_role_idx" ON "profiles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "companies_ownerId_key" ON "companies"("ownerId");

-- CreateIndex
CREATE INDEX "user_documents_userId_status_idx" ON "user_documents"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plateNumber_key" ON "vehicles"("plateNumber");

-- CreateIndex
CREATE INDEX "vehicles_companyId_status_idx" ON "vehicles"("companyId", "status");

-- CreateIndex
CREATE INDEX "vehicles_type_status_isAvailable_idx" ON "vehicles"("type", "status", "isAvailable");

-- CreateIndex
CREATE INDEX "vehicle_docs_vehicleId_expiresAt_idx" ON "vehicle_docs"("vehicleId", "expiresAt");

-- CreateIndex
CREATE INDEX "vehicle_docs_vehicleId_status_idx" ON "vehicle_docs"("vehicleId", "status");

-- CreateIndex
CREATE INDEX "transport_requests_senderId_status_idx" ON "transport_requests"("senderId", "status");

-- CreateIndex
CREATE INDEX "transport_requests_originCountry_destCountry_status_idx" ON "transport_requests"("originCountry", "destCountry", "status");

-- CreateIndex
CREATE INDEX "transport_requests_pickupDate_status_idx" ON "transport_requests"("pickupDate", "status");

-- CreateIndex
CREATE INDEX "missions_carrierId_status_idx" ON "missions"("carrierId", "status");

-- CreateIndex
CREATE INDEX "missions_requestId_idx" ON "missions"("requestId");

-- CreateIndex
CREATE INDEX "commercial_deals_buyerId_status_idx" ON "commercial_deals"("buyerId", "status");

-- CreateIndex
CREATE INDEX "commercial_deals_sellerId_status_idx" ON "commercial_deals"("sellerId", "status");

-- CreateIndex
CREATE INDEX "commercial_deals_linkedMissionId_idx" ON "commercial_deals"("linkedMissionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_gatewayTxId_key" ON "payments"("gatewayTxId");

-- CreateIndex
CREATE INDEX "payments_payerId_status_idx" ON "payments"("payerId", "status");

-- CreateIndex
CREATE INDEX "payments_missionId_idx" ON "payments"("missionId");

-- CreateIndex
CREATE INDEX "payments_dealId_idx" ON "payments"("dealId");

-- CreateIndex
CREATE UNIQUE INDEX "customs_requirements_originCountry_destCountry_goodsCategor_key" ON "customs_requirements"("originCountry", "destCountry", "goodsCategory");

-- CreateIndex
CREATE INDEX "customs_dossiers_missionId_status_idx" ON "customs_dossiers"("missionId", "status");

-- CreateIndex
CREATE INDEX "customs_documents_dossierId_status_idx" ON "customs_documents"("dossierId", "status");

-- CreateIndex
CREATE INDEX "customs_documents_uploadedBy_idx" ON "customs_documents"("uploadedBy");

-- CreateIndex
CREATE INDEX "messages_missionId_sentAt_idx" ON "messages"("missionId", "sentAt");

-- CreateIndex
CREATE INDEX "messages_dealId_sentAt_idx" ON "messages"("dealId", "sentAt");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId", "readAt");

-- CreateIndex
CREATE INDEX "reviews_revieweeId_idx" ON "reviews"("revieweeId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_missionId_reviewerId_key" ON "reviews"("missionId", "reviewerId");

-- CreateIndex
CREATE INDEX "leads_type_createdAt_idx" ON "leads"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_documents" ADD CONSTRAINT "user_documents_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_docs" ADD CONSTRAINT "vehicle_docs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_requests" ADD CONSTRAINT "transport_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "transport_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_deals" ADD CONSTRAINT "commercial_deals_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_deals" ADD CONSTRAINT "commercial_deals_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commercial_deals" ADD CONSTRAINT "commercial_deals_linkedMissionId_fkey" FOREIGN KEY ("linkedMissionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payeeId_fkey" FOREIGN KEY ("payeeId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "commercial_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_dossiers" ADD CONSTRAINT "customs_dossiers_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_dossiers" ADD CONSTRAINT "customs_dossiers_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "customs_requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_documents" ADD CONSTRAINT "customs_documents_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "customs_dossiers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customs_documents" ADD CONSTRAINT "customs_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "commercial_deals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
