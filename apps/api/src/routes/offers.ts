import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";
import * as offerRepo from "../repositories/offer.repository.js";
import * as notificationService from "../services/notification.service.js";
import { TransportRequestNotFoundError } from "../utils/errors.js";

const createBodySchema = z.object({
  requestId: z.string().uuid(),
  vehicleId: z.string().uuid().optional(),
  proposedPrice: z.number().positive(),
  message: z.string().optional(),
  availableDate: z.string().optional(),
});

export async function offersRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.post<{ Body: z.infer<typeof createBodySchema> }>("/", async (request, reply) => {
    const parsed = createBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const { requestId, vehicleId, proposedPrice, message, availableDate } = parsed.data;

    const tr = await prisma.transportRequest.findUnique({
      where: { id: requestId },
      include: { sender: true },
    });
    if (!tr) throw new TransportRequestNotFoundError();
    if (tr.status !== "PUBLISHED") {
      return reply.status(400).send({
        success: false,
        error: "Cette demande n'accepte plus de propositions",
        code: "BAD_REQUEST",
      });
    }

    const created = await offerRepo.create({
      requestId,
      carrierId: request.user!.id,
      vehicleId,
      proposedPrice,
      message,
      availableDate: availableDate ? new Date(availableDate) : undefined,
    });

    await notificationService.createNotification({
      userId: tr.senderId,
      title: "Nouvelle proposition reçue",
      body: `Un transporteur vous a fait une proposition sur la demande ${tr.reference ?? requestId.slice(0, 8)}.`,
      type: "mission",
      linkUrl: `/dashboard/expediteur/demandes/${requestId}`,
    });

    return reply.status(201).send({ success: true, data: created });
  });

  app.get("/", async (request, reply) => {
    const carrierId = request.user!.id;
    const items = await offerRepo.findManyByCarrier(carrierId);
    return reply.send({ success: true, data: items });
  });

  app.post<{ Params: { id: string } }>("/:id/accept", async (request, reply) => {
    const { id: offerId } = request.params;
    const userId = request.user!.id;

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        request: { include: { sender: true } },
        carrier: true,
        vehicle: true,
      },
    });
    if (!offer) {
      return reply.status(404).send({
        success: false,
        error: "Proposition non trouvée",
        code: "OFFER_NOT_FOUND",
      });
    }
    if (offer.request.senderId !== userId) {
      return reply.status(403).send({
        success: false,
        error: "Seul l'expéditeur peut accepter cette proposition",
        code: "FORBIDDEN",
      });
    }
    if (offer.status !== "PENDING") {
      return reply.status(400).send({
        success: false,
        error: "Cette proposition a déjà été traitée",
        code: "BAD_REQUEST",
      });
    }

    const missionRef = `MSN-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

    const [mission] = await prisma.$transaction([
      prisma.mission.create({
        data: {
          reference: missionRef,
          requestId: offer.requestId,
          carrierId: offer.carrierId,
          vehicleId: offer.vehicleId ?? undefined,
          agreedPrice: offer.proposedPrice,
        },
      }),
      prisma.offer.update({
        where: { id: offerId },
        data: { status: "ACCEPTED" },
      }),
      prisma.offer.updateMany({
        where: {
          requestId: offer.requestId,
          id: { not: offerId },
        },
        data: { status: "REJECTED" },
      }),
      prisma.transportRequest.update({
        where: { id: offer.requestId },
        data: { status: "MATCHED" },
      }),
    ]);

    await notificationService.createNotification({
      userId: offer.carrierId,
      title: "Proposition acceptée",
      body: `Votre proposition sur la demande ${offer.request.reference ?? ""} a été acceptée. Mission ${missionRef} créée.`,
      type: "mission",
      linkUrl: `/dashboard/missions/${mission.id}`,
    });

    return reply.send({ success: true, data: mission });
  });

  app.get<{ Querystring: { requestId: string } }>("/by-request", async (request, reply) => {
    const requestId = request.query.requestId;
    if (!requestId) {
      return reply.status(400).send({
        success: false,
        error: "requestId required",
        code: "VALIDATION_ERROR",
      });
    }
    const items = await offerRepo.findManyByRequest(requestId);
    return reply.send({ success: true, data: items });
  });
}
