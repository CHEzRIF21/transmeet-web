"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsRoutes = notificationsRoutes;
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
async function notificationsRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const notifications = await prisma_js_1.prisma.notification.findMany({
            where: { userId },
            orderBy: { sentAt: "desc" },
            take: 50,
        });
        const unreadCount = await prisma_js_1.prisma.notification.count({
            where: { userId, readAt: null },
        });
        return reply.send({
            success: true,
            data: { notifications, unreadCount },
        });
    });
    app.patch("/:id/read", async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        await prisma_js_1.prisma.notification.updateMany({
            where: { id, userId },
            data: { readAt: new Date() },
        });
        return reply.send({ success: true });
    });
    app.post("/mark-all-read", async (request, reply) => {
        const userId = request.user.id;
        await prisma_js_1.prisma.notification.updateMany({
            where: { userId, readAt: null },
            data: { readAt: new Date() },
        });
        return reply.send({ success: true });
    });
}
//# sourceMappingURL=notifications.js.map