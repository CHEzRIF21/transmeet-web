"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const fastify_1 = __importDefault(require("fastify"));
(0, dotenv_1.config)();
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const logger_js_1 = require("./utils/logger.js");
const auth_js_1 = require("./routes/auth.js");
const users_js_1 = require("./routes/users.js");
const companies_js_1 = require("./routes/companies.js");
const vehicles_js_1 = require("./routes/vehicles.js");
const transport_requests_js_1 = require("./routes/transport-requests.js");
const missions_js_1 = require("./routes/missions.js");
const payments_js_1 = require("./routes/payments.js");
const customs_js_1 = require("./routes/customs.js");
const messages_js_1 = require("./routes/messages.js");
const notifications_js_1 = require("./routes/notifications.js");
const leads_js_1 = require("./routes/leads.js");
const offers_js_1 = require("./routes/offers.js");
const admin_js_1 = require("./routes/admin.js");
const upload_js_1 = require("./routes/upload.js");
const errors_js_1 = require("./utils/errors.js");
const app = (0, fastify_1.default)({ logger: false });
async function build() {
    await app.register(cors_1.default, {
        origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
        credentials: true,
    });
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false,
    });
    await app.register(rate_limit_1.default, {
        max: Number(process.env.RATE_LIMIT_MAX ?? 100),
        timeWindow: "1 minute",
    });
    app.get("/health", async () => {
        return { status: "ok" };
    });
    await app.register(auth_js_1.authRoutes, { prefix: "/api/v1" });
    await app.register(users_js_1.usersRoutes, { prefix: "/api/v1/users" });
    await app.register(companies_js_1.companiesRoutes, { prefix: "/api/v1/companies" });
    await app.register(vehicles_js_1.vehiclesRoutes, { prefix: "/api/v1/vehicles" });
    await app.register(transport_requests_js_1.transportRequestsRoutes, {
        prefix: "/api/v1/transport-requests",
    });
    await app.register(missions_js_1.missionsRoutes, { prefix: "/api/v1/missions" });
    await app.register(payments_js_1.paymentsRoutes, { prefix: "/api/v1/payments" });
    await app.register(customs_js_1.customsRoutes, { prefix: "/api/v1/customs" });
    await app.register(messages_js_1.messagesRoutes, { prefix: "/api/v1/messages" });
    await app.register(notifications_js_1.notificationsRoutes, {
        prefix: "/api/v1/notifications",
    });
    await app.register(leads_js_1.leadsRoutes, { prefix: "/api/v1/leads" });
    await app.register(offers_js_1.offersRoutes, { prefix: "/api/v1/offers" });
    await app.register(admin_js_1.adminRoutes, { prefix: "/api/v1/admin" });
    await app.register(upload_js_1.uploadRoutes, { prefix: "/api/v1/upload" });
    app.setErrorHandler((err, _request, reply) => {
        logger_js_1.logger.error({ err }, "Request error");
        const statusCode = err instanceof errors_js_1.AppError ? err.statusCode : 500;
        const code = err instanceof errors_js_1.AppError ? err.code : "INTERNAL_ERROR";
        reply.status(statusCode).send({
            success: false,
            error: err.message ?? "Internal Server Error",
            code,
        });
    });
    return app;
}
async function start() {
    try {
        const app = await build();
        const port = Number(process.env.PORT ?? 4000);
        await app.listen({ port, host: "0.0.0.0" });
        logger_js_1.logger.info({ port }, "API server listening");
    }
    catch (err) {
        logger_js_1.logger.error({ err }, "Failed to start server");
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map