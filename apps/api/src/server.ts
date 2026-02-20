import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { logger } from "./utils/logger.js";
import { authRoutes } from "./routes/auth.js";
import { usersRoutes } from "./routes/users.js";
import { companiesRoutes } from "./routes/companies.js";
import { vehiclesRoutes } from "./routes/vehicles.js";
import { transportRequestsRoutes } from "./routes/transport-requests.js";
import { missionsRoutes } from "./routes/missions.js";
import { paymentsRoutes } from "./routes/payments.js";
import { customsRoutes } from "./routes/customs.js";
import { messagesRoutes } from "./routes/messages.js";
import { notificationsRoutes } from "./routes/notifications.js";
import { leadsRoutes } from "./routes/leads.js";

const app = Fastify({ logger: false });

async function build() {
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  await app.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX ?? 100),
    timeWindow: "1 minute",
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });

  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(usersRoutes, { prefix: "/api/v1/users" });
  await app.register(companiesRoutes, { prefix: "/api/v1/companies" });
  await app.register(vehiclesRoutes, { prefix: "/api/v1/vehicles" });
  await app.register(transportRequestsRoutes, {
    prefix: "/api/v1/transport-requests",
  });
  await app.register(missionsRoutes, { prefix: "/api/v1/missions" });
  await app.register(paymentsRoutes, { prefix: "/api/v1/payments" });
  await app.register(customsRoutes, { prefix: "/api/v1/customs" });
  await app.register(messagesRoutes, { prefix: "/api/v1/messages" });
  await app.register(notificationsRoutes, {
    prefix: "/api/v1/notifications",
  });
  await app.register(leadsRoutes, { prefix: "/api/v1/leads" });

  app.setErrorHandler((err, _request, reply) => {
    logger.error({ err }, "Request error");
    reply.status(err.statusCode ?? 500).send({
      success: false,
      error: err.message ?? "Internal Server Error",
      code: "INTERNAL_ERROR",
    });
  });

  return app;
}

async function start() {
  try {
    const app = await build();
    const port = Number(process.env.PORT ?? 4000);
    await app.listen({ port, host: "0.0.0.0" });
    logger.info({ port }, "API server listening");
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}

start();
