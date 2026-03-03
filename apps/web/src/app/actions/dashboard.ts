"use server";

import { prisma } from "@/lib/db";
import type { MissionStatus, RequestStatus } from "@prisma/client";

// ─── Types pour les stats et missions ──────────────────────────────────────

export interface ExpediteurStats {
  missionsEnCours: number;
  revenusGeneres: number;
  transporteursActifs: number;
  satisfactionMoyenne: number;
}

export interface MissionListItem {
  id: string;
  ref: string;
  origin: string;
  destination: string;
  date: string;
  cargo: string;
  transporteur: string;
  status: string;
}

export interface TransporteurStats {
  missionsEnCours: number;
  revenusGeneres: number;
  vehiculesActifs: number;
  missionsLivrees: number;
}

export interface AdminStats {
  missionsTotal: number;
  utilisateursTotal: number;
  demandesEnAttente: number;
  revenusPlateforme: number;
}

// ─── Formatters ────────────────────────────────────────────────────────────

const locale = "fr-FR";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function formatXOF(amount: number): string {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount)) + " FCFA";
}

function mapMissionStatus(s: MissionStatus): string {
  const map: Record<MissionStatus, string> = {
    ASSIGNED: "En attente",
    LOADING: "Chargement",
    IN_TRANSIT: "En transit",
    AT_CUSTOMS: "En douane",
    DELIVERED: "Livré",
    DISPUTED: "Litige",
  };
  return map[s] ?? s;
}

// ─── Actions Expéditeur ─────────────────────────────────────────────────────

export async function getExpediteurStats(userId: string): Promise<ExpediteurStats> {
  try {
    const [missionsEnCours, completedMissions, transporteursUnique, reviews] =
      await Promise.all([
        prisma.mission.count({
          where: {
            request: { senderId: userId },
            status: { in: ["ASSIGNED", "LOADING", "IN_TRANSIT", "AT_CUSTOMS"] },
          },
        }),
        prisma.mission.findMany({
          where: {
            request: { senderId: userId },
            status: "DELIVERED",
          },
          include: { payments: true },
        }),
        prisma.mission.findMany({
          where: { request: { senderId: userId } },
          select: { carrierId: true },
          distinct: ["carrierId"],
        }),
        prisma.review.findMany({
          where: {
            mission: { request: { senderId: userId } },
          },
          select: { rating: true },
        }),
      ]);

    const revenusGeneres = completedMissions.reduce(
      (sum, m) => sum + Number(m.agreedPrice ?? 0),
      0
    );
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 98;

    return {
      missionsEnCours,
      transporteursActifs: transporteursUnique.length,
      revenusGeneres: Number(revenusGeneres),
      satisfactionMoyenne: Math.round(avgRating),
    };
  } catch {
    return {
      missionsEnCours: 0,
      revenusGeneres: 0,
      transporteursActifs: 0,
      satisfactionMoyenne: 0,
    };
  }
}

export async function getExpediteurRecentMissions(
  userId: string,
  limit = 5
): Promise<MissionListItem[]> {
  try {
    const missions = await prisma.mission.findMany({
      where: { request: { senderId: userId } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        request: true,
        carrier: true,
      },
    });

    return missions.map((m) => ({
      id: m.id,
      ref: `#TR-${m.id.slice(0, 4).toUpperCase()}`,
      origin: `${m.request.originCity}, ${m.request.originCountry}`,
      destination: `${m.request.destCity}, ${m.request.destCountry}`,
      date: formatDate(m.createdAt),
      cargo: `${m.request.weightTons}T · ${m.request.goodsType}`,
      transporteur: m.carrier?.email?.split("@")[0] ?? "—",
      status: mapMissionStatus(m.status),
    }));
  } catch {
    return [];
  }
}

// ─── Actions Transporteur ──────────────────────────────────────────────────

export async function getTransporteurStats(
  userId: string
): Promise<TransporteurStats> {
  try {
    const [missionsEnCours, completedMissions, vehiclesCount] = await Promise.all(
      [
        prisma.mission.count({
          where: {
            carrierId: userId,
            status: { in: ["ASSIGNED", "LOADING", "IN_TRANSIT", "AT_CUSTOMS"] },
          },
        }),
        prisma.mission.findMany({
          where: { carrierId: userId, status: "DELIVERED" },
        }),
        prisma.vehicle.count({
          where: {
            company: { ownerId: userId },
            isAvailable: true,
          },
        }),
      ]
    );

    const revenusGeneres = completedMissions.reduce(
      (sum, m) => sum + Number(m.agreedPrice ?? 0),
      0
    );

    return {
      missionsEnCours,
      revenusGeneres: Number(revenusGeneres),
      vehiculesActifs: vehiclesCount,
      missionsLivrees: completedMissions.length,
    };
  } catch {
    return {
      missionsEnCours: 0,
      revenusGeneres: 0,
      vehiculesActifs: 0,
      missionsLivrees: 0,
    };
  }
}

export async function getTransporteurRecentMissions(
  userId: string,
  limit = 5
): Promise<MissionListItem[]> {
  try {
    const missions = await prisma.mission.findMany({
      where: { carrierId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        request: true,
      },
    });

    return missions.map((m) => ({
      id: m.id,
      ref: `#TR-${m.id.slice(0, 4).toUpperCase()}`,
      origin: `${m.request.originCity}, ${m.request.originCountry}`,
      destination: `${m.request.destCity}, ${m.request.destCountry}`,
      date: formatDate(m.createdAt),
      cargo: `${m.request.weightTons}T · ${m.request.goodsType}`,
      transporteur: "Vous",
      status: mapMissionStatus(m.status),
    }));
  } catch {
    return [];
  }
}

// ─── Actions Admin ─────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [missionsTotal, utilisateursTotal, demandesEnAttente, payments] =
      await Promise.all([
        prisma.mission.count(),
        prisma.user.count(),
        prisma.transportRequest.count({
          where: { status: { in: ["DRAFT", "PUBLISHED"] as RequestStatus[] } },
        }),
        prisma.payment.findMany({
          where: { status: "RELEASED" },
          select: { commission: true },
        }),
      ]);

    const revenusPlateforme = payments.reduce(
      (sum, p) => sum + Number(p.commission ?? 0),
      0
    );

    return {
      missionsTotal,
      utilisateursTotal,
      demandesEnAttente,
      revenusPlateforme: Number(revenusPlateforme),
    };
  } catch {
    return {
      missionsTotal: 0,
      utilisateursTotal: 0,
      demandesEnAttente: 0,
      revenusPlateforme: 0,
    };
  }
}

export async function getAdminRecentMissions(
  limit = 5
): Promise<MissionListItem[]> {
  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        request: true,
        carrier: true,
      },
    });

    return missions.map((m) => ({
      id: m.id,
      ref: `#TR-${m.id.slice(0, 4).toUpperCase()}`,
      origin: `${m.request.originCity}, ${m.request.originCountry}`,
      destination: `${m.request.destCity}, ${m.request.destCountry}`,
      date: formatDate(m.createdAt),
      cargo: `${m.request.weightTons}T · ${m.request.goodsType}`,
      transporteur: m.carrier?.email?.split("@")[0] ?? "—",
      status: mapMissionStatus(m.status),
    }));
  } catch {
    return [];
  }
}
