import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";

export async function usersRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/me", async (request, reply) => {
    const userId = request.user!.id;
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
    });
    if (!profile) {
      return reply.status(404).send({
        success: false,
        error: "Profil non trouvé",
        code: "NOT_FOUND",
      });
    }
    return reply.send({ success: true, data: profile });
  });
}
