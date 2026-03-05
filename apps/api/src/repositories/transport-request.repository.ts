import { prisma } from "./prisma.js";
import type { RequestStatus } from "@prisma/client";

export async function findManyBySender(senderId: string, status?: RequestStatus) {
  return prisma.transportRequest.findMany({
    where: {
      senderId,
      ...(status && { status }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, full_name: true, email: true, phone: true } },
      missions: {
        take: 1,
        include: { carrier: { select: { full_name: true } } },
      },
    },
  });
}

export async function findManyPublished(status?: RequestStatus) {
  return prisma.transportRequest.findMany({
    where: {
      status: status ?? "PUBLISHED",
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, full_name: true, email: true, phone: true } },
      missions: {
        take: 1,
        include: { carrier: { select: { full_name: true } } },
      },
    },
  });
}

export async function findById(id: string) {
  return prisma.transportRequest.findUnique({
    where: { id },
    include: {
      sender: true,
      offers: {
        include: {
          carrier: { select: { id: true, full_name: true, email: true, phone: true } },
          vehicle: true,
        },
      },
    },
  });
}

export async function create(data: {
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
}) {
  return prisma.transportRequest.create({
    data: {
      ...data,
      currency: data.currency ?? "XOF",
    },
  });
}

export async function updateStatus(id: string, status: RequestStatus) {
  return prisma.transportRequest.update({
    where: { id },
    data: { status },
  });
}
