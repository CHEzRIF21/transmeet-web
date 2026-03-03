"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const registerBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(["EXPEDITEUR", "TRANSPORTEUR"]),
    phone: zod_1.z.string().optional(),
});
const loginBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const refreshBodySchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
async function authRoutes(app, _opts) {
    app.post("/auth/register", async (request, reply) => {
        const parsed = registerBodySchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: parsed.error.flatten(),
            });
        }
        // TODO: AuthService.register(parsed.data)
        return reply.status(201).send({
            success: true,
            data: { id: "placeholder", email: parsed.data.email, role: parsed.data.role },
            message: "Compte créé",
        });
    });
    app.post("/auth/login", async (request, reply) => {
        const parsed = loginBodySchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: parsed.error.flatten(),
            });
        }
        // TODO: AuthService.login(parsed.data)
        return reply.send({
            success: true,
            data: {
                accessToken: "placeholder-token",
                refreshToken: "placeholder-refresh",
                user: { id: "placeholder", email: parsed.data.email, role: "EXPEDITEUR" },
            },
        });
    });
    app.post("/auth/refresh", async (request, reply) => {
        const parsed = refreshBodySchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: parsed.error.flatten(),
            });
        }
        // TODO: AuthService.refreshToken(parsed.data.refreshToken)
        return reply.send({
            success: true,
            data: {
                accessToken: "placeholder-token",
                refreshToken: "placeholder-refresh",
            },
        });
    });
    app.get("/auth/me", async (_request, reply) => {
        // TODO: vérifier JWT et retourner user
        return reply.send({
            success: true,
            data: {
                id: "placeholder",
                email: "user@example.com",
                role: "EXPEDITEUR",
            },
        });
    });
    app.post("/auth/logout", async (_request, reply) => {
        // TODO: invalider refresh token
        return reply.send({
            success: true,
            message: "Déconnexion réussie",
        });
    });
}
//# sourceMappingURL=auth.js.map