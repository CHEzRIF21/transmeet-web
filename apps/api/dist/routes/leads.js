"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = leadsRoutes;
const zod_1 = require("zod");
const prisma_js_1 = require("../repositories/prisma.js");
const errors_js_1 = require("../utils/errors.js");
const truckTypeItemSchema = zod_1.z.object({
    type: zod_1.z.string().min(1, "Type de camion requis"),
    quantity: zod_1.z.number().int().positive("Quantité > 0 requise"),
});
const baseLeadObject = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string().min(6).max(32).optional(),
    company: zod_1.z.string().min(2).optional(),
    message: zod_1.z.string().max(2000).optional(),
});
const baseLeadRefine = (data, ctx) => {
    const hasContact = (data.email && data.email !== "") || (data.phone && data.phone.length >= 6);
    if (!hasContact) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Téléphone ou email requis",
            path: ["email"],
        });
    }
    const hasIdentity = (data.name && data.name.length >= 2) || (data.company && data.company.length >= 2);
    if (!hasIdentity) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Nom/prénom ou nom d'entreprise requis",
            path: ["name"],
        });
    }
};
const expediteurSchema = baseLeadObject
    .extend({
    type: zod_1.z.literal("EXPEDITEUR"),
    departureCity: zod_1.z.string().min(2, "Ville de départ requise"),
    arrivalCity: zod_1.z.string().min(2, "Ville d'arrivée requise"),
    truckTypes: zod_1.z.array(truckTypeItemSchema).min(1, "Au moins un type de camion requis"),
})
    .superRefine(baseLeadRefine);
const transporteurSchema = baseLeadObject
    .extend({
    type: zod_1.z.literal("TRANSPORTEUR"),
    truckTypes: zod_1.z.array(truckTypeItemSchema).min(1, "Au moins un type de camion requis"),
})
    .superRefine(baseLeadRefine);
const btpSchema = baseLeadObject
    .extend({
    type: zod_1.z.literal("BTP"),
    projectType: zod_1.z.string().min(2),
    equipments: zod_1.z.array(zod_1.z.string()).min(1),
    startDate: zod_1.z.string().optional(),
    endDate: zod_1.z.string().optional(),
})
    .superRefine(baseLeadRefine);
const contactSchema = baseLeadObject
    .extend({
    type: zod_1.z.literal("CONTACT"),
    subject: zod_1.z.string().min(2),
})
    .superRefine(baseLeadRefine);
const leadSchema = zod_1.z.union([
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
            const cleanName = name?.trim() || undefined;
            const cleanEmail = email?.trim() || undefined;
            await prisma_js_1.prisma.lead.create({
                data: {
                    type: type,
                    name: cleanName,
                    email: cleanEmail,
                    phone: phone?.trim() || undefined,
                    company: company?.trim() || undefined,
                    message: message?.trim() || undefined,
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