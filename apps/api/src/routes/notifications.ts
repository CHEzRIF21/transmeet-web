import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";

export async function notificationsRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (request, reply) => {
    const userId = request.user!.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, readAt: null },
    });

    return reply.send({
      success: true,
      data: { notifications, unreadCount },
    });
  });

  app.patch<{ Params: { id: string } }>("/:id/read", async (request, reply) => {
    const { id } = request.params;
    const userId = request.user!.id;

    await prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });

    return reply.send({ success: true });
  });

  app.post("/mark-all-read", async (request, reply) => {
    const userId = request.user!.id;

    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });

    return reply.send({ success: true });
  });
}
