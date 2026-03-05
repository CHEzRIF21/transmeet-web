"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = createNotification;
const prisma_js_1 = require("../repositories/prisma.js");
async function createNotification(data) {
    return prisma_js_1.prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            body: data.body,
            type: data.type ?? "systeme",
            channel: "IN_APP",
            linkUrl: data.linkUrl,
        },
    });
}
//# sourceMappingURL=notification.service.js.map