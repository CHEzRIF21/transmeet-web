import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";

const sendBodySchema = z.object({
  conversationId: z.string().uuid().optional(),
  missionId: z.string().uuid().optional(),
  expediteurId: z.string().uuid(),
  transporteurId: z.string().uuid(),
  content: z.string().min(1),
  type: z.enum(["TEXT", "FILE", "OFFER", "SYSTEM"]).optional(),
  fileUrl: z.string().url().optional(),
});

export async function messagesRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/conversations", async (request, reply) => {
    const userId = request.user!.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ expediteurId: userId }, { transporteurId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        expediteur: { select: { id: true, full_name: true } },
        transporteur: { select: { id: true, full_name: true } },
        mission: { select: { id: true, reference: true } },
      },
    });

    const withLastMessage = await Promise.all(
      conversations.map(async (c) => {
        const last = await prisma.message.findFirst({
          where: { conversationId: c.id },
          orderBy: { sentAt: "desc" },
          select: { content: true, sentAt: true },
        });
        const unread = await prisma.message.count({
          where: {
            conversationId: c.id,
            senderId: { not: userId },
            readAt: null,
          },
        });
        return {
          ...c,
          dernier_message: last?.content,
          dernier_message_at: last?.sentAt,
          non_lus: unread,
        };
      })
    );

    return reply.send({ success: true, data: withLastMessage });
  });

  app.get<{ Querystring: { conversationId: string } }>("/", async (request, reply) => {
    const conversationId = request.query.conversationId;
    if (!conversationId) {
      return reply.status(400).send({
        success: false,
        error: "conversationId required",
        code: "VALIDATION_ERROR",
      });
    }
    const userId = request.user!.id;

    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ expediteurId: userId }, { transporteurId: userId }],
      },
    });
    if (!conv) {
      return reply.status(404).send({
        success: false,
        error: "Conversation non trouvée",
        code: "NOT_FOUND",
      });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: "asc" },
      include: {
        sender: { select: { id: true, full_name: true } },
      },
    });

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return reply.send({ success: true, data: messages });
  });

  app.post<{ Body: z.infer<typeof sendBodySchema> }>("/", async (request, reply) => {
    const parsed = sendBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const userId = request.user!.id;
    const { conversationId, missionId, expediteurId, transporteurId, content, type, fileUrl } =
      parsed.data;

    let convId = conversationId;
    if (!convId) {
      const existing = await prisma.conversation.findFirst({
        where: {
          missionId: missionId ?? undefined,
          expediteurId,
          transporteurId,
        },
      });
      if (existing) {
        convId = existing.id;
      } else {
        const created = await prisma.conversation.create({
          data: {
            missionId,
            expediteurId,
            transporteurId,
          },
        });
        convId = created.id;
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: convId,
        roomType: "MISSION",
        senderId: userId,
        missionId,
        content,
        type: type ?? "TEXT",
        fileUrl,
      },
    });

    return reply.status(201).send({ success: true, data: message });
  });
}
