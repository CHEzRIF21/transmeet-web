"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = leadsRoutes;
const zod_1 = require("zod");
const prisma_js_1 = require("../repositories/prisma.js");
const errors_js_1 = require("../utils/errors.js");
const baseLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(6).max(32).optional(),
    company: zod_1.z.string().min(2).optional(),
    message: zod_1.z.string().min(5).max(2000).optional(),
});
const expediteurSchema = baseLeadSchema.extend({
    type: zod_1.z.literal("EXPEDITEUR"),
    goodsType: zod_1.z.string().min(2),
    destination: zod_1.z.string().min(2),
    truckType: zod_1.z.string().min(2),
});
const transporteurSchema = baseLeadSchema.extend({
    type: zod_1.z.literal("TRANSPORTEUR"),
    truckType: zod_1.z.string().min(2),
    capacity: zod_1.z.string().min(1),
    zone: zod_1.z.string().min(2),
    experienceYears: zod_1.z.string().min(1),
});
const btpSchema = baseLeadSchema.extend({
    type: zod_1.z.literal("BTP"),
    projectType: zod_1.z.string().min(2),
    equipments: zod_1.z.array(zod_1.z.string()).min(1),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
});
const contactSchema = baseLeadSchema.extend({
    type: zod_1.z.literal("CONTACT"),
    subject: zod_1.z.string().min(2),
});
const leadSchema = zod_1.z.discriminatedUnion("type", [
    expediteurSchema,
    transporteurSchema,
    btpSchema,
    contactSchema,
]);
async function leadsRoutes(app, _opts) {
    app.post("/", async (request, _reply) => {
        try {
            const parsed = leadSchema.parse(request.body);
            const { type, name, email, phone, company, message, ...metadata } = parsed;
            await prisma_js_1.prisma.lead.create({
                data: {
                    type,
                    name,
                    email,
                    phone,
                    company,
                    message,
                    metadata: Object.keys(metadata).length ? metadata : undefined,
                },
            });
            return {
                success: true,
                message: "Votre demande a bien été prise en compte.",
            };
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                throw new errors_js_1.ValidationError("Données invalides");
            }
            throw err;
        }
    });
}
//# sourceMappingURL=leads.js.map