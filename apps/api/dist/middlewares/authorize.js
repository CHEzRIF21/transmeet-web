"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = requireRole;
exports.requireAdmin = requireAdmin;
const prisma_js_1 = require("../repositories/prisma.js");
const errors_js_1 = require("../utils/errors.js");
function requireRole(...allowedRoles) {
    const normalized = new Set(allowedRoles.map((r) => r.toUpperCase()));
    return async function (request, _reply) {
        if (!request.user?.id) {
            throw new errors_js_1.UnauthorizedError();
        }
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: request.user.id },
            select: { role: true },
        });
        if (!profile) {
            throw new errors_js_1.UnauthorizedError();
        }
        const userRole = profile.role?.toUpperCase() ?? "";
        if (!normalized.has(userRole)) {
            throw new errors_js_1.UnauthorizedError();
        }
    };
}
function requireAdmin() {
    return requireRole("admin", "ADMIN");
}
//# sourceMappingURL=authorize.js.map