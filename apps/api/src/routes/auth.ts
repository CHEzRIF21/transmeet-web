import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["EXPEDITEUR", "TRANSPORTEUR"]),
  phone: z.string().optional(),
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshBodySchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.post<{
    Body: z.infer<typeof registerBodySchema>;
  }>("/auth/register", async (request, reply) => {
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

  app.post<{
    Body: z.infer<typeof loginBodySchema>;
  }>("/auth/login", async (request, reply) => {
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

  app.post<{
    Body: z.infer<typeof refreshBodySchema>;
  }>("/auth/refresh", async (request, reply) => {
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
