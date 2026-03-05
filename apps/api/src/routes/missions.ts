import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";
import * as notificationService from "../services/notification.service.js";
import { MissionNotFoundError } from "../utils/errors.js";

const VALID_TRANSITIONS: Record<string, string[]> = {
  ASSIGNED: ["LOADING"],
  LOADING: ["IN_TRANSIT"],
  IN_TRANSIT: ["AT_CUSTOMS", "DELIVERED"],
  AT_CUSTOMS: ["IN_TRANSIT", "DELIVERED"],
  DELIVERED: [],
  DISPUTED: [],
};

const updateStatusSchema = z.object({
  status: z.enum(["ASSIGNED", "LOADING", "IN_TRANSIT", "AT_CUSTOMS", "DELIVERED", "DISPUTED"]),
});

const reviewBodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const trackingBodySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  speedKmh: z.number().optional(),
  heading: z.number().optional(),
  locality: z.string().optional(),
});

export async function missionsRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (request, reply) => {
    const userId = request.user!.id;
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    const role = profile?.role?.toUpperCase() ?? "";

    const where =
      role === "ADMIN"
        ? {}
        : role === "TRANSPORTEUR"
          ? { carrierId: userId }
          : { request: { senderId: userId } };

    const missions = await prisma.mission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        request: true,
        carrier: { select: { id: true, full_name: true, email: true, phone: true } },
        vehicle: true,
      },
    });

    return reply.send({ success: true, data: missions });
  });

  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.id;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        request: true,
        carrier: { select: { id: true, full_name: true, email: true, phone: true } },
        vehicle: true,
      },
    });

    if (!mission) throw new MissionNotFoundError();

    const isExpediteur = mission.request.senderId === userId;
    const isTransporteur = mission.carrierId === userId;
    const isAdmin = (await prisma.profile.findUnique({ where: { id: userId }, select: { role: true } }))?.role?.toUpperCase() === "ADMIN";

    if (!isExpediteur && !isTransporteur && !isAdmin) {
      return reply.status(403).send({
        success: false,
        error: "Accès non autorisé",
        code: "FORBIDDEN",
      });
    }

    return reply.send({ success: true, data: mission });
  });

  app.patch<{
    Params: { id: string };
    Body: z.infer<typeof updateStatusSchema>;
  }>("/:id/status", async (request, reply) => {
    const { id } = request.params;
    const parsed = updateStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const userId = request.user!.id;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { request: true },
    });
    if (!mission) throw new MissionNotFoundError();
    if (mission.carrierId !== userId) {
      return reply.status(403).send({
        success: false,
        error: "Seul le transporteur peut modifier le statut",
        code: "FORBIDDEN",
      });
    }

    const allowed = VALID_TRANSITIONS[mission.status];
    if (!allowed?.includes(parsed.data.status)) {
      return reply.status(400).send({
        success: false,
        error: `Transition invalide: ${mission.status} → ${parsed.data.status}`,
        code: "BAD_REQUEST",
      });
    }

    const updated = await prisma.mission.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.status === "LOADING" && { pickupConfirmedAt: new Date() }),
        ...(parsed.data.status === "DELIVERED" && { deliveryConfirmedAt: new Date() }),
      },
    });

    await notificationService.createNotification({
      userId: mission.request.senderId,
      title: "Mission mise à jour",
      body: `La mission ${mission.reference ?? id} est maintenant : ${parsed.data.status}`,
      type: "mission",
      linkUrl: `/dashboard/missions/${id}`,
    });

    return reply.send({ success: true, data: updated });
  });

  app.post<{
    Params: { id: string };
    Body: z.infer<typeof reviewBodySchema>;
  }>("/:id/review", async (request, reply) => {
    const { id } = request.params;
    const parsed = reviewBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const userId = request.user!.id;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { request: true },
    });
    if (!mission) throw new MissionNotFoundError();
    if (mission.request.senderId !== userId) {
      return reply.status(403).send({
        success: false,
        error: "Seul l'expéditeur peut noter cette mission",
        code: "FORBIDDEN",
      });
    }
    if (mission.status !== "DELIVERED") {
      return reply.status(400).send({
        success: false,
        error: "La mission doit être livrée avant de pouvoir noter",
        code: "BAD_REQUEST",
      });
    }

    const review = await prisma.review.upsert({
      where: {
        missionId_reviewerId: { missionId: id, reviewerId: userId },
      },
      create: {
        missionId: id,
        reviewerId: userId,
        revieweeId: mission.carrierId,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
      update: {
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    return reply.send({ success: true, data: review });
  });

  app.post<{
    Params: { id: string };
    Body: z.infer<typeof trackingBodySchema>;
  }>("/:id/tracking", async (request, reply) => {
    const { id } = request.params;
    const parsed = trackingBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const userId = request.user!.id;

    const mission = await prisma.mission.findUnique({ where: { id } });
    if (!mission) throw new MissionNotFoundError();
    if (mission.carrierId !== userId) {
      return reply.status(403).send({
        success: false,
        error: "Seul le transporteur peut envoyer sa position",
        code: "FORBIDDEN",
      });
    }

    const position = await prisma.trackingPosition.create({
      data: {
        missionId: id,
        latitude: parsed.data.latitude,
        longitude: parsed.data.longitude,
        speedKmh: parsed.data.speedKmh,
        heading: parsed.data.heading,
        locality: parsed.data.locality,
      },
    });

    return reply.status(201).send({ success: true, data: position });
  });

  app.get<{ Params: { id: string } }>("/:id/tracking", async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.id;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { request: true },
    });
    if (!mission) throw new MissionNotFoundError();
    const isExpediteur = mission.request.senderId === userId;
    const isTransporteur = mission.carrierId === userId;
    const profile = await prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
    const isAdmin = profile?.role?.toUpperCase() === "ADMIN";
    if (!isExpediteur && !isTransporteur && !isAdmin) {
      return reply.status(403).send({
        success: false,
        error: "Accès non autorisé",
        code: "FORBIDDEN",
      });
    }

    const positions = await prisma.trackingPosition.findMany({
      where: { missionId: id },
      orderBy: { createdAt: "asc" },
    });

    return reply.send({ success: true, data: positions });
  });
}
