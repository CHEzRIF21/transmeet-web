"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportRequestsRoutes = transportRequestsRoutes;
const zod_1 = require("zod");
const authenticate_js_1 = require("../middlewares/authenticate.js");
const prisma_js_1 = require("../repositories/prisma.js");
const transportRequestRepo = __importStar(require("../repositories/transport-request.repository.js"));
const errors_js_1 = require("../utils/errors.js");
const createBodySchema = zod_1.z.object({
    originCity: zod_1.z.string().min(1),
    originCountry: zod_1.z.string().length(3).default("BEN"),
    destCity: zod_1.z.string().min(1),
    destCountry: zod_1.z.string().length(3).default("BEN"),
    goodsType: zod_1.z.string().min(1),
    weightTons: zod_1.z.number().positive(),
    volumeM3: zod_1.z.number().positive().optional(),
    pickupDate: zod_1.z.string().datetime().or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    deliveryDate: zod_1.z.string().optional(),
    proposedPrice: zod_1.z.number().nonnegative(),
    currency: zod_1.z.string().optional(),
    specialNotes: zod_1.z.string().optional(),
});
function nextRef() {
    const y = new Date().getFullYear();
    const n = Math.floor(Math.random() * 9000) + 1000;
    return `DEM-${y}-${n}`;
}
async function transportRequestsRoutes(app, _opts) {
    app.addHook("preHandler", authenticate_js_1.authenticate);
    app.get("/", async (request, reply) => {
        const userId = request.user.id;
        const profile = await prisma_js_1.prisma.profile.findUnique({
            where: { id: userId },
            select: { role: true },
        });
        const role = profile?.role?.toLowerCase() ?? "";
        let items;
        if (role === "expediteur") {
            items = await transportRequestRepo.findManyBySender(userId);
        }
        else if (role === "transporteur" || role === "admin") {
            items = await transportRequestRepo.findManyPublished();
        }
        else {
            items = await transportRequestRepo.findManyBySender(userId);
        }
        return reply.send({ success: true, data: items });
    });
    app.post("/", async (request, reply) => {
        const parsed = createBodySchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({
                success: false,
                error: "Validation failed",
                code: "VALIDATION_ERROR",
                details: parsed.error.flatten(),
            });
        }
        const data = parsed.data;
        const pickupDate = new Date(data.pickupDate);
        const deliveryDate = data.deliveryDate ? new Date(data.deliveryDate) : undefined;
        const created = await transportRequestRepo.create({
            reference: nextRef(),
            senderId: request.user.id,
            originCity: data.originCity,
            originCountry: data.originCountry,
            destCity: data.destCity,
            destCountry: data.destCountry,
            goodsType: data.goodsType,
            weightTons: data.weightTons,
            volumeM3: data.volumeM3,
            pickupDate,
            deliveryDate,
            proposedPrice: data.proposedPrice,
            currency: data.currency,
            status: "PUBLISHED",
            specialNotes: data.specialNotes,
        });
        return reply.status(201).send({ success: true, data: created });
    });
    app.get("/:id", async (request, reply) => {
        const { id } = request.params;
        const req = await transportRequestRepo.findById(id);
        if (!req) {
            throw new errors_js_1.TransportRequestNotFoundError();
        }
        return reply.send({ success: true, data: req });
    });
}
//# sourceMappingURL=transport-requests.js.map