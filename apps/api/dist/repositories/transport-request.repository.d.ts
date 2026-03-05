import type { RequestStatus } from "@prisma/client";
export declare function findManyBySender(senderId: string, status?: RequestStatus): Promise<({
    missions: ({
        carrier: {
            full_name: string | null;
        };
    } & {
        status: import("@prisma/client").$Enums.MissionStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string | null;
        requestId: string;
        carrierId: string;
        vehicleId: string | null;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        pickupEstimatedAt: Date | null;
        deliveryEstimatedAt: Date | null;
        pickupConfirmedAt: Date | null;
        deliveryConfirmedAt: Date | null;
        trackingUpdates: import("@prisma/client/runtime/library").JsonValue | null;
    })[];
    sender: {
        email: string | null;
        phone: string | null;
        id: string;
        full_name: string | null;
    };
} & {
    status: import("@prisma/client").$Enums.RequestStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    reference: string | null;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: import("@prisma/client/runtime/library").Decimal;
    volumeM3: import("@prisma/client/runtime/library").Decimal | null;
    pickupDate: Date;
    deliveryDate: Date | null;
    proposedPrice: import("@prisma/client/runtime/library").Decimal;
    currency: string;
    specialNotes: string | null;
})[]>;
export declare function findManyPublished(status?: RequestStatus): Promise<({
    missions: ({
        carrier: {
            full_name: string | null;
        };
    } & {
        status: import("@prisma/client").$Enums.MissionStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string | null;
        requestId: string;
        carrierId: string;
        vehicleId: string | null;
        agreedPrice: import("@prisma/client/runtime/library").Decimal;
        commissionRate: import("@prisma/client/runtime/library").Decimal;
        pickupEstimatedAt: Date | null;
        deliveryEstimatedAt: Date | null;
        pickupConfirmedAt: Date | null;
        deliveryConfirmedAt: Date | null;
        trackingUpdates: import("@prisma/client/runtime/library").JsonValue | null;
    })[];
    sender: {
        email: string | null;
        phone: string | null;
        id: string;
        full_name: string | null;
    };
} & {
    status: import("@prisma/client").$Enums.RequestStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    reference: string | null;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: import("@prisma/client/runtime/library").Decimal;
    volumeM3: import("@prisma/client/runtime/library").Decimal | null;
    pickupDate: Date;
    deliveryDate: Date | null;
    proposedPrice: import("@prisma/client/runtime/library").Decimal;
    currency: string;
    specialNotes: string | null;
})[]>;
export declare function findById(id: string): Promise<({
    offers: ({
        vehicle: {
            status: import("@prisma/client").$Enums.VehicleStatus;
            type: import("@prisma/client").$Enums.VehicleType;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyId: string;
            plateNumber: string;
            capacityTons: import("@prisma/client/runtime/library").Decimal;
            capacityM3: import("@prisma/client/runtime/library").Decimal | null;
            countryReg: string;
            isAvailable: boolean;
            currentLat: import("@prisma/client/runtime/library").Decimal | null;
            currentLng: import("@prisma/client/runtime/library").Decimal | null;
        } | null;
        carrier: {
            email: string | null;
            phone: string | null;
            id: string;
            full_name: string | null;
        };
    } & {
        status: import("@prisma/client").$Enums.OfferStatus;
        message: string | null;
        id: string;
        createdAt: Date;
        proposedPrice: import("@prisma/client/runtime/library").Decimal;
        requestId: string;
        carrierId: string;
        vehicleId: string | null;
        availableDate: Date | null;
    })[];
    sender: {
        email: string | null;
        role: string;
        phone: string | null;
        id: string;
        full_name: string | null;
        avatar_url: string | null;
        is_active: boolean;
        kyc_status: string | null;
        company_id: string | null;
        created_at: Date;
        updated_at: Date;
    };
} & {
    status: import("@prisma/client").$Enums.RequestStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    reference: string | null;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: import("@prisma/client/runtime/library").Decimal;
    volumeM3: import("@prisma/client/runtime/library").Decimal | null;
    pickupDate: Date;
    deliveryDate: Date | null;
    proposedPrice: import("@prisma/client/runtime/library").Decimal;
    currency: string;
    specialNotes: string | null;
}) | null>;
export declare function create(data: {
    reference?: string;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: number;
    volumeM3?: number;
    pickupDate: Date;
    deliveryDate?: Date;
    proposedPrice: number;
    currency?: string;
    status?: RequestStatus;
    specialNotes?: string;
}): Promise<{
    status: import("@prisma/client").$Enums.RequestStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    reference: string | null;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: import("@prisma/client/runtime/library").Decimal;
    volumeM3: import("@prisma/client/runtime/library").Decimal | null;
    pickupDate: Date;
    deliveryDate: Date | null;
    proposedPrice: import("@prisma/client/runtime/library").Decimal;
    currency: string;
    specialNotes: string | null;
}>;
export declare function updateStatus(id: string, status: RequestStatus): Promise<{
    status: import("@prisma/client").$Enums.RequestStatus;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    reference: string | null;
    senderId: string;
    originCity: string;
    originCountry: string;
    destCity: string;
    destCountry: string;
    goodsType: string;
    weightTons: import("@prisma/client/runtime/library").Decimal;
    volumeM3: import("@prisma/client/runtime/library").Decimal | null;
    pickupDate: Date;
    deliveryDate: Date | null;
    proposedPrice: import("@prisma/client/runtime/library").Decimal;
    currency: string;
    specialNotes: string | null;
}>;
//# sourceMappingURL=transport-request.repository.d.ts.map