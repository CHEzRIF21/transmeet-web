import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { authenticate } from "../middlewares/authenticate.js";
import { requireAdmin } from "../middlewares/authorize.js";
import { prisma } from "../repositories/prisma.js";

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
}
