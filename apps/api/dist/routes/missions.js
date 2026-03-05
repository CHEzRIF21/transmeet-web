"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionsRoutes = missionsRoutes;
const zod_1 = require("zod");
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
const notificationService = __importStar(require("../services/notification.service.js"));
const errors_js_1 = require("../utils/errors.js");
const VALID_TRANSITIONS = {
    ASSIGNED: ["LOADING"],
    LOADING: ["IN_TRANSIT"],
    IN_TRANSIT: ["AT_CUSTOMS", "DELIVERED"],
    AT_CUSTOMS: ["IN_TRANSIT", "DELIVERED"],
    DELIVERED: [],
    DISPUTED: [],
};
const updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["ASSIGNED", "LOADING", "IN_TRANSIT", "AT_CUSTOMS", "DELIVERED", "DISPUTED"]),
});
const reviewBodySchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().optional(),
});
const trackingBodySchema = zod_1.z.object({
    latitude: zod_1.z.number(),
    longitude: zod_1.z.number(),
    speedKmh: zod_1.z.number().optional(),
    heading: zod_1.z.number().optional(),
    locality: zod_1.z.string().optional(),
});
async function missionsRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        const role = profile?.role?.toUpperCase() ?? "";
        const where = role === "ADMIN"
            ? {}
            : role === "TRANSPORTEUR"
                ? { carrierId: userId }
                : { request: { senderId: userId } };
        const missions = await prisma_js_1.prisma.mission.findMany({
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
    app.get("/:id", async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        const mission = await prisma_js_1.prisma.mission.findUnique({
            where: { id },
            include: {
                request: true,
                carrier: { select: { id: true, full_name: true, email: true, phone: true } },
                vehicle: true,
            },
        });
        if (!mission)
            throw new errors_js_1.MissionNotFoundError();
        const isExpediteur = mission.request.senderId === userId;
        const isTransporteur = mission.carrierId === userId;
        const isAdmin = (await prisma_js_1.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } }))?.role?.toUpperCase() === "ADMIN";
        if (!isExpediteur && !isTransporteur && !isAdmin) {
            return reply.status(403).send({
                success: false,
                error: "Accès non autorisé",
                code: "FORBIDDEN",
            });
        }
        return reply.send({ success: true, data: mission });
    });
    app.patch("/:id/status", async (request, reply) => {
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
        const userId = request.user.id;
        const mission = await prisma_js_1.prisma.mission.findUnique({
            where: { id },
            include: { request: true },
        });
        if (!mission)
            throw new errors_js_1.MissionNotFoundError();
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
        const updated = await prisma_js_1.prisma.mission.update({
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
    app.post("/:id/review", async (request, reply) => {
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
        const userId = request.user.id;
        const mission = await prisma_js_1.prisma.mission.findUnique({
            where: { id },
            include: { request: true },
        });
        if (!mission)
            throw new errors_js_1.MissionNotFoundError();
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
        const review = await prisma_js_1.prisma.review.upsert({
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
    app.post("/:id/tracking", async (request, reply) => {
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
        const userId = request.user.id;
        const mission = await prisma_js_1.prisma.mission.findUnique({ where: { id } });
        if (!mission)
            throw new errors_js_1.MissionNotFoundError();
        if (mission.carrierId !== userId) {
            return reply.status(403).send({
                success: false,
                error: "Seul le transporteur peut envoyer sa position",
                code: "FORBIDDEN",
            });
        }
        const position = await prisma_js_1.prisma.trackingPosition.create({
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
    app.get("/:id/tracking", async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        const mission = await prisma_js_1.prisma.mission.findUnique({
            where: { id },
            include: { request: true },
        });
        if (!mission)
            throw new errors_js_1.MissionNotFoundError();
        const isExpediteur = mission.request.senderId === userId;
        const isTransporteur = mission.carrierId === userId;
        const profile = await prisma_js_1.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
        const isAdmin = profile?.role?.toUpperCase() === "ADMIN";
        if (!isExpediteur && !isTransporteur && !isAdmin) {
            return reply.status(403).send({
                success: false,
                error: "Accès non autorisé",
                code: "FORBIDDEN",
            });
        }
        const positions = await prisma_js_1.prisma.trackingPosition.findMany({
            where: { missionId: id },
            orderBy: { createdAt: "asc" },
        });
        return reply.send({ success: true, data: positions });
    });
}
//# sourceMappingURL=missions.js.map