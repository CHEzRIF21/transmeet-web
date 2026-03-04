CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "preferredLang" VARCHAR(5) NOT NULL DEFAULT 'fr',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "lastLoginAt" TIMESTAMPTZ,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

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
