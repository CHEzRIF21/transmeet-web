"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadsRoutes = leadsRoutes;
const zod_1 = require("zod");
const validations_1 = require("@transmit/validations");
const prisma_js_1 = require("../repositories/prisma.js");
const errors_js_1 = require("../utils/errors.js");
async function leadsRoutes(app, _opts) {
    app.post("/", async (request, _reply) => {
        try {
            const parsed = validations_1.leadSchema.parse(request.body);
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