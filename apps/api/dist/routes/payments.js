"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = paymentsRoutes;
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
const pdfkit_1 = __importDefault(require("pdfkit"));
async function paymentsRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        const role = profile?.role?.toUpperCase() ?? "";
        const where = role === "ADMIN"
            ? {}
            : role === "TRANSPORTEUR"
                ? { payeeId: userId }
                : { payerId: userId };
        const payments = await prisma_js_1.prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                mission: { select: { reference: true, id: true } },
                payer: { select: { full_name: true, email: true } },
                payee: { select: { full_name: true, email: true } },
            },
        });
        return reply.send({ success: true, data: payments });
    });
    app.get("/:id/receipt", async (request, reply) => {
        const { id } = request.params;
        const userId = request.user.id;
        const payment = await prisma_js_1.prisma.payment.findUnique({
            where: { id },
            include: {
                mission: true,
                payer: true,
                payee: true,
            },
        });
        if (!payment) {
            return reply.status(404).send({
                success: false,
                error: "Paiement non trouvé",
                code: "NOT_FOUND",
            });
        }
        const isPayer = payment.payerId === userId;
        const isPayee = payment.payeeId === userId;
        const profile = await prisma_js_1.prisma.profile.findUnique({ where: { id: userId }, select: { role: true } });
        const isAdmin = profile?.role?.toUpperCase() === "ADMIN";
        if (!isPayer && !isPayee && !isAdmin) {
            return reply.status(403).send({
                success: false,
                error: "Accès non autorisé",
                code: "FORBIDDEN",
            });
        }
        const doc = new pdfkit_1.default({ margin: 50 });
        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.fontSize(20).text("Transmeet", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text("Reçu de paiement", { align: "center" });
        doc.moveDown(2);
        doc.fontSize(10)
            .text(`N° Transaction: ${payment.id}`, { continued: false })
            .text(`Mission: ${payment.mission?.reference ?? payment.missionId ?? "—"}`, { continued: false })
            .text(`Montant: ${Number(payment.amount).toLocaleString("fr-FR")} XOF`, { continued: false })
            .text(`Commission: ${Number(payment.commission).toLocaleString("fr-FR")} XOF`, { continued: false })
            .text(`Net: ${(Number(payment.amount) - Number(payment.commission)).toLocaleString("fr-FR")} XOF`, { continued: false })
            .text(`Méthode: ${payment.method}`, { continued: false })
            .text(`Statut: ${payment.status}`, { continued: false })
            .text(`Date: ${payment.createdAt.toISOString().slice(0, 19).replace("T", " ")}`, { continued: false });
        doc.end();
        const pdf = await new Promise((resolve, reject) => {
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
        });
        return reply
            .header("Content-Type", "application/pdf")
            .header("Content-Disposition", `attachment; filename="recu-${payment.id}.pdf"`)
            .send(pdf);
    });
    app.get("/export", async (request, reply) => {
        const userId = request.user.id;
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        const role = profile?.role?.toUpperCase() ?? "";
        const where = role === "ADMIN"
            ? {}
            : role === "TRANSPORTEUR"
                ? { payeeId: userId }
                : { payerId: userId };
        const payments = await prisma_js_1.prisma.payment.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                mission: { select: { reference: true } },
                payer: { select: { full_name: true } },
                payee: { select: { full_name: true } },
            },
        });
        const header = "id,mission,montant,commission,net,methode,statut,date\n";
        const rows = payments.map((p) => `${p.id},${p.mission?.reference ?? ""},${p.amount},${p.commission},${Number(p.amount) - Number(p.commission)},${p.method},${p.status},${p.createdAt.toISOString()}`);
        const csv = header + rows.join("\n");
        return reply
            .header("Content-Type", "text/csv; charset=utf-8")
            .header("Content-Disposition", 'attachment; filename="paiements.csv"')
            .send(Buffer.from("\ufeff" + csv, "utf-8"));
    });
}
//# sourceMappingURL=payments.js.map