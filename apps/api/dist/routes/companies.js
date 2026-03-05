"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companiesRoutes = companiesRoutes;
const zod_1 = require("zod");
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
const createBodySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    type: zod_1.z.enum(["EXPEDITEUR", "TRANSPORTEUR", "NEGOCIANT"]),
    country: zod_1.z.string().length(3),
    taxId: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
async function companiesRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const companies = await prisma_js_1.prisma.company.findMany({
            where: { ownerId: userId },
            include: { vehicles: true },
        });
        return reply.send({ success: true, data: companies });
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
        const existing = await prisma_js_1.prisma.company.findUnique({
            where: { ownerId: userId },
        });
        if (existing) {
            return reply.status(400).send({
                success: false,
                error: "Vous avez déjà une entreprise",
                code: "ALREADY_EXISTS",
            });
        }
        const company = await prisma_js_1.prisma.company.create({
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
//# sourceMappingURL=companies.js.map