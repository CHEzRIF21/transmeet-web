"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = usersRoutes;
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
async function usersRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/me", async (request, reply) => {
        const userId = request.user.id;
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: userId },
        });
        if (!profile) {
            return reply.status(404).send({
                success: false,
                error: "Profil non trouvé",
                code: "NOT_FOUND",
            });
        }
        return reply.send({ success: true, data: profile });
    });
}
//# sourceMappingURL=users.js.map