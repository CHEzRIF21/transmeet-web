-- Add OfferStatus enum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- Add CARTE_PROFESSIONNELLE to UserDocumentType (ignore if exists)
DO $$ BEGIN
  ALTER TYPE "UserDocumentType" ADD VALUE 'CARTE_PROFESSIONNELLE';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add MARCHANDISE to VehicleType (ignore if exists)
DO $$ BEGIN
  ALTER TYPE "VehicleType" ADD VALUE 'MARCHANDISE';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Alter profiles: add email, phone, avatar_url, is_active, kyc_status
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "kyc_status" TEXT DEFAULT 'pending';

-- Alter user_documents: add rejectionNote
ALTER TABLE "user_documents" ADD COLUMN IF NOT EXISTS "rejectionNote" TEXT;

-- Alter transport_requests: add reference
ALTER TABLE "transport_requests" ADD COLUMN IF NOT EXISTS "reference" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "transport_requests_reference_key" ON "transport_requests"("reference");

-- Alter missions: add reference, make vehicleId nullable, add estimated dates
ALTER TABLE "missions" ADD COLUMN IF NOT EXISTS "reference" TEXT;
ALTER TABLE "missions" ADD COLUMN IF NOT EXISTS "pickupEstimatedAt" TIMESTAMPTZ;
ALTER TABLE "missions" ADD COLUMN IF NOT EXISTS "deliveryEstimatedAt" TIMESTAMPTZ;
ALTER TABLE "missions" ALTER COLUMN "vehicleId" DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "missions_reference_key" ON "missions"("reference");

-- Alter notifications: add linkUrl, set channel default
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "linkUrl" TEXT;
ALTER TABLE "notifications" ALTER COLUMN "channel" SET DEFAULT 'IN_APP';

-- Create offers table
CREATE TABLE IF NOT EXISTS "offers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requestId" UUID NOT NULL,
    "carrierId" UUID NOT NULL,
    "vehicleId" UUID,
    "proposedPrice" DECIMAL(15,0) NOT NULL,
    "message" TEXT,
    "availableDate" DATE,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "offers_requestId_carrierId_key" ON "offers"("requestId", "carrierId");
CREATE INDEX IF NOT EXISTS "offers_carrierId_idx" ON "offers"("carrierId");
CREATE INDEX IF NOT EXISTS "offers_requestId_idx" ON "offers"("requestId");

ALTER TABLE "offers" ADD CONSTRAINT "offers_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "transport_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "offers" ADD CONSTRAINT "offers_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "offers" ADD CONSTRAINT "offers_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create tracking_positions table
CREATE TABLE IF NOT EXISTS "tracking_positions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "missionId" UUID NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "speedKmh" DECIMAL(10,2),
    "heading" DECIMAL(5,2),
    "locality" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tracking_positions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tracking_positions_missionId_idx" ON "tracking_positions"("missionId");

ALTER TABLE "tracking_positions" ADD CONSTRAINT "tracking_positions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create conversations table
CREATE TABLE IF NOT EXISTS "conversations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "missionId" UUID,
    "expediteurId" UUID NOT NULL,
    "transporteurId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "conversations_missionId_expediteurId_transporteurId_key" ON "conversations"("missionId", "expediteurId", "transporteurId");
CREATE INDEX IF NOT EXISTS "conversations_expediteurId_idx" ON "conversations"("expediteurId");
CREATE INDEX IF NOT EXISTS "conversations_transporteurId_idx" ON "conversations"("transporteurId");

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_expediteurId_fkey" FOREIGN KEY ("expediteurId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_transporteurId_fkey" FOREIGN KEY ("transporteurId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS "platform_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "platform_settings_key_key" ON "platform_settings"("key");

-- Alter messages: add conversationId
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "conversationId" UUID;
ALTER TABLE "messages" ALTER COLUMN "roomType" SET DEFAULT 'MISSION';

CREATE INDEX IF NOT EXISTS "messages_conversationId_sentAt_idx" ON "messages"("conversationId", "sentAt");

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
