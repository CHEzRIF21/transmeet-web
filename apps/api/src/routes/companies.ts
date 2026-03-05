import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";

const createBodySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["EXPEDITEUR", "TRANSPORTEUR", "NEGOCIANT"]),
  country: z.string().length(3),
  taxId: z.string().optional(),
  address: z.string().optional(),
});

export async function companiesRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (request, reply) => {
    const userId = request.user!.id;
    const companies = await prisma.company.findMany({
      where: { ownerId: userId },
      include: { vehicles: true },
    });
    return reply.send({ success: true, data: companies });
  });

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
    const userId = request.user!.id;

    const existing = await prisma.company.findUnique({
      where: { ownerId: userId },
    });
    if (existing) {
      return reply.status(400).send({
        success: false,
        error: "Vous avez déjà une entreprise",
        code: "ALREADY_EXISTS",
      });
    }

    const company = await prisma.company.create({
      data: {
        ownerId: userId,
        name: parsed.data.name,
        type: parsed.data.type,
        country: parsed.data.country,
        taxId: parsed.data.taxId,
        address: parsed.data.address,
      },
    });

    return reply.status(201).send({ success: true, data: company });
  });
}
