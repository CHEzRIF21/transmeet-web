import { prisma } from "./prisma.js";
import type { OfferStatus } from "@prisma/client";

export async function create(data: {
  requestId: string;
  carrierId: string;
  vehicleId?: string;
  proposedPrice: number;
  message?: string;
  availableDate?: Date;
}) {
  return prisma.offer.upsert({
    where: {
      requestId_carrierId: {
        requestId: data.requestId,
        carrierId: data.carrierId,
      },
    },
    create: {
      ...data,
      status: "PENDING",
    },
    update: {
      proposedPrice: data.proposedPrice,
      vehicleId: data.vehicleId,
      message: data.message,
      availableDate: data.availableDate,
    },
  });
}

export async function findManyByCarrier(carrierId: string) {
  return prisma.offer.findMany({
    where: { carrierId },
    orderBy: { createdAt: "desc" },
    include: {
      request: {
        include: {
          sender: { select: { id: true, full_name: true, email: true, phone: true } },
        },
      },
      vehicle: true,
    },
  });
}

export async function findManyByRequest(requestId: string) {
  return prisma.offer.findMany({
    where: { requestId },
    include: {
      carrier: { select: { id: true, full_name: true, email: true, phone: true } },
      vehicle: true,
    },
  });
}

export async function updateStatus(id: string, status: OfferStatus) {
  return prisma.offer.update({
    where: { id },
    data: { status },
  });
}
