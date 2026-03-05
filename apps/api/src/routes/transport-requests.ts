import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { requireRole } from "../middlewares/authorize.js";
import { prisma } from "../repositories/prisma.js";
import * as transportRequestRepo from "../repositories/transport-request.repository.js";
import { TransportRequestNotFoundError } from "../utils/errors.js";

const createBodySchema = z.object({
  originCity: z.string().min(1),
  originCountry: z.string().length(3).default("BEN"),
  destCity: z.string().min(1),
  destCountry: z.string().length(3).default("BEN"),
  goodsType: z.string().min(1),
  weightTons: z.number().positive(),
  volumeM3: z.number().positive().optional(),
  pickupDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  deliveryDate: z.string().optional(),
  proposedPrice: z.number().nonnegative(),
  currency: z.string().optional(),
  specialNotes: z.string().optional(),
});

function nextRef(): string {
  const y = new Date().getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `DEM-${y}-${n}`;
}

export async function transportRequestsRoutes(
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
    const role = profile?.role?.toLowerCase() ?? "";

    let items;
    if (role === "expediteur") {
      items = await transportRequestRepo.findManyBySender(userId);
    } else if (role === "transporteur" || role === "admin") {
      items = await transportRequestRepo.findManyPublished();
    } else {
      items = await transportRequestRepo.findManyBySender(userId);
    }

    return reply.send({ success: true, data: items });
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
    const data = parsed.data;
    const pickupDate = new Date(data.pickupDate);
    const deliveryDate = data.deliveryDate ? new Date(data.deliveryDate) : undefined;

    const created = await transportRequestRepo.create({
      reference: nextRef(),
      senderId: request.user!.id,
      originCity: data.originCity,
      originCountry: data.originCountry,
      destCity: data.destCity,
      destCountry: data.destCountry,
      goodsType: data.goodsType,
      weightTons: data.weightTons,
      volumeM3: data.volumeM3,
      pickupDate,
      deliveryDate,
      proposedPrice: data.proposedPrice,
      currency: data.currency,
      status: "PUBLISHED",
      specialNotes: data.specialNotes,
    });

    return reply.status(201).send({ success: true, data: created });
  });

  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const req = await transportRequestRepo.findById(id);
    if (!req) {
      throw new TransportRequestNotFoundError();
    }
    return reply.send({ success: true, data: req });
  });
}
