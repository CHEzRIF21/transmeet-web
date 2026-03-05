"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesRoutes = vehiclesRoutes;
const zod_1 = require("zod");
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
const createBodySchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid(),
    plateNumber: zod_1.z.string().min(1),
    type: zod_1.z.enum(["PLATEAU", "CITERNE", "FRIGO", "BENNE", "CONTENEUR", "BACHE", "MARCHANDISE"]),
    capacityTons: zod_1.z.number().positive(),
    capacityM3: zod_1.z.number().positive().optional(),
    countryReg: zod_1.z.string().length(3),
});
const updateBodySchema = zod_1.z.object({
    plateNumber: zod_1.z.string().min(1).optional(),
    type: zod_1.z.enum(["PLATEAU", "CITERNE", "FRIGO", "BENNE", "CONTENEUR", "BACHE", "MARCHANDISE"]).optional(),
    capacityTons: zod_1.z.number().positive().optional(),
    capacityM3: zod_1.z.number().positive().optional(),
    countryReg: zod_1.z.string().length(3).optional(),
    status: zod_1.z.enum(["AVAILABLE", "ON_MISSION", "MAINTENANCE", "INACTIVE"]).optional(),
});
async function vehiclesRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const companies = await prisma_js_1.prisma.company.findMany({
            where: { ownerId: userId },
            select: { id: true },
        });
        const companyIds = companies.map((c) => c.id);
        const vehicles = await prisma_js_1.prisma.vehicle.findMany({
            where: { companyId: { in: companyIds } },
            include: { documents: true },
        });
        return reply.send({ success: true, data: vehicles });
    });
    app.post("/", async (request, reply) => {
        const parsed = createBodySchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: parsed.error.flatten(),
            });
        }
        const userId = request.user.id;
        const company = await prisma_js_1.prisma.company.findFirst({
            where: { id: parsed.data.companyId, ownerId: userId },
        });
        if (!company) {
            return reply.status(403).send({
                success: false,
                error: "Entreprise non trouvée ou accès refusé",
                code: "FORBIDDEN",
            });
        }
        const vehicle = await prisma_js_1.prisma.vehicle.create({
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
    app.patch("/:id", async (request, reply) => {
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
        const userId = request.user.id;
        const vehicle = await prisma_js_1.prisma.vehicle.findFirst({
            where: { id, company: { ownerId: userId } },
        });
        if (!vehicle) {
            return reply.status(404).send({
                success: false,
                error: "Véhicule non trouvé",
                code: "NOT_FOUND",
            });
        }
        const updated = await prisma_js_1.prisma.vehicle.update({
            where: { id },
            data: parsed.data,
        });
        return reply.send({ success: true, data: updated });
    });
}
//# sourceMappingURL=vehicles.js.map