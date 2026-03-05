import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { prisma } from "../repositories/prisma.js";

const createBodySchema = z.object({
  companyId: z.string().uuid(),
  plateNumber: z.string().min(1),
  type: z.enum(["PLATEAU", "CITERNE", "FRIGO", "BENNE", "CONTENEUR", "BACHE", "MARCHANDISE"]),
  capacityTons: z.number().positive(),
  capacityM3: z.number().positive().optional(),
  countryReg: z.string().length(3),
});

const updateBodySchema = z.object({
  plateNumber: z.string().min(1).optional(),
  type: z.enum(["PLATEAU", "CITERNE", "FRIGO", "BENNE", "CONTENEUR", "BACHE", "MARCHANDISE"]).optional(),
  capacityTons: z.number().positive().optional(),
  capacityM3: z.number().positive().optional(),
  countryReg: z.string().length(3).optional(),
  status: z.enum(["AVAILABLE", "ON_MISSION", "MAINTENANCE", "INACTIVE"]).optional(),
});

export async function vehiclesRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);

  app.get("/", async (request, reply) => {
    const userId = request.user!.id;
    const companies = await prisma.company.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });
    const companyIds = companies.map((c) => c.id);

    const vehicles = await prisma.vehicle.findMany({
      where: { companyId: { in: companyIds } },
      include: { documents: true },
    });

    return reply.send({ success: true, data: vehicles });
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

    const company = await prisma.company.findFirst({
      where: { id: parsed.data.companyId, ownerId: userId },
    });
    if (!company) {
      return reply.status(403).send({
        success: false,
        error: "Entreprise non trouvée ou accès refusé",
        code: "FORBIDDEN",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        companyId: parsed.data.companyId,
        plateNumber: parsed.data.plateNumber,
        type: parsed.data.type,
        capacityTons: parsed.data.capacityTons,
        capacityM3: parsed.data.capacityM3,
        countryReg: parsed.data.countryReg,
      },
    });

    return reply.status(201).send({ success: true, data: vehicle });
  });

  app.patch<{
    Params: { id: string };
    Body: z.infer<typeof updateBodySchema>;
  }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const parsed = updateBodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const userId = request.user!.id;

    const vehicle = await prisma.vehicle.findFirst({
      where: { id, company: { ownerId: userId } },
    });
    if (!vehicle) {
      return reply.status(404).send({
        success: false,
        error: "Véhicule non trouvé",
        code: "NOT_FOUND",
      });
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: parsed.data,
    });

    return reply.send({ success: true, data: updated });
  });
}
