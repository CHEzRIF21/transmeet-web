import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { LeadType } from "@prisma/client";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { requireAdmin } from "../middlewares/authorize.js";
import { prisma } from "../repositories/prisma.js";

const leadListQuerySchema = z.object({
  type: z.enum(["ALL", "EXPEDITEUR", "TRANSPORTEUR", "BTP", "CONTACT"]).optional().default("ALL"),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(25),
});

const updateSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

const kycReviewSchema = z.object({
  statut: z.enum(["APPROVED", "REJECTED"]),
  rejectionNote: z.string().optional(),
});

export async function adminRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireAdmin());

  app.get("/users", async (request, reply) => {
    const users = await prisma.profile.findMany({
      where: { role: { not: "admin" } },
      orderBy: { created_at: "desc" },
      include: {
        _count: {
          select: {
            sentRequests: true,
            carrierMissions: true,
          },
        },
      },
    });

    return reply.send({
      success: true,
      data: users.map((u) => ({
        ...u,
        nb_demandes: u._count?.sentRequests ?? 0,
        nb_missions: u._count?.carrierMissions ?? 0,
        _count: undefined,
      })),
    });
  });

  app.patch<{ Params: { id: string }; Body: { is_active?: boolean } }>(
    "/users/:id",
    async (request, reply) => {
      const { id } = request.params;
      const { is_active } = request.body ?? {};
      if (typeof is_active !== "boolean") {
        return reply.status(400).send({
          success: false,
          error: "is_active doit être un booléen",
          code: "VALIDATION_ERROR",
        });
      }
      const updated = await prisma.profile.update({
        where: { id },
        data: { is_active },
      });
      return reply.send({ success: true, data: updated });
    }
  );

  app.get("/kyc", async (request, reply) => {
    const docs = await prisma.userDocument.findMany({
      where: { user: { role: "transporteur" } },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, full_name: true, email: true, phone: true } },
      },
    });

    return reply.send({ success: true, data: docs });
  });

  app.patch<{
    Params: { id: string };
    Body: z.infer<typeof kycReviewSchema>;
  }>("/kyc/:id", async (request, reply) => {
    const { id } = request.params;
    const parsed = kycReviewSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const doc = await prisma.userDocument.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!doc) {
      return reply.status(404).send({
        success: false,
        error: "Document non trouvé",
        code: "NOT_FOUND",
      });
    }

    const status = parsed.data.statut === "APPROVED" ? "APPROVED" : "REJECTED";
    const kycStatus = status === "APPROVED" ? "validated" : "rejected";

    await prisma.$transaction([
      prisma.userDocument.update({
        where: { id },
        data: {
          status,
          rejectionNote: parsed.data.rejectionNote,
          reviewedBy: request.user!.id,
          reviewedAt: new Date(),
        },
      }),
      prisma.profile.update({
        where: { id: doc.userId },
        data: { kyc_status: kycStatus },
      }),
    ]);

    return reply.send({ success: true });
  });

  app.get("/settings", async (request, reply) => {
    const settings = await prisma.platformSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s]));
    return reply.send({ success: true, data: map });
  });

  app.patch<{
    Body: z.infer<typeof updateSettingSchema>;
  }>("/settings", async (request, reply) => {
    const parsed = updateSettingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const updated = await prisma.platformSetting.upsert({
      where: { key: parsed.data.key },
      create: {
        key: parsed.data.key,
        value: parsed.data.value,
        updatedBy: request.user!.id,
      },
      update: {
        value: parsed.data.value,
        updatedBy: request.user!.id,
      },
    });

    return reply.send({ success: true, data: updated });
  });

  app.get("/stats", async (request, reply) => {
    const [totalExpediteurs, totalTransporteurs, payments, missionsActive] =
      await Promise.all([
        prisma.profile.count({ where: { role: "expediteur" } }),
        prisma.profile.count({ where: { role: "transporteur" } }),
        prisma.payment.aggregate({
          where: { status: "RELEASED" },
          _count: true,
          _sum: { amount: true, commission: true },
        }),
        prisma.mission.count({ where: { status: "IN_TRANSIT" } }),
      ]);

    return reply.send({
      success: true,
      data: {
        total_expediteurs: totalExpediteurs,
        total_transporteurs: totalTransporteurs,
        paiements_total: payments._count,
        volume_total: Number(payments._sum.amount ?? 0),
        commissions_total: Number(payments._sum.commission ?? 0),
        missions_actives: missionsActive,
      },
    });
  });

  app.get("/leads", async (request, reply) => {
    const parsed = leadListQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: "Paramètres invalides",
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }
    const { type, search, page, limit } = parsed.data;

    const where = {
      ...(type && type !== "ALL" ? { type: type as LeadType } : {}),
      ...(search?.trim()
        ? {
            OR: [
              { name: { contains: search.trim(), mode: "insensitive" as const } },
              { email: { contains: search.trim(), mode: "insensitive" as const } },
              { company: { contains: search.trim(), mode: "insensitive" as const } },
              { phone: { contains: search.trim() } },
            ],
          }
        : {}),
    };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    const data = leads.map((l) => ({
      id: l.id,
      type: l.type,
      name: l.name,
      email: l.email,
      phone: l.phone,
      company: l.company,
      message: l.message,
      metadata: l.metadata,
      createdAt: l.createdAt.toISOString(),
    }));

    return reply.send({
      success: true,
      data,
      total,
      page,
    });
  });
}
