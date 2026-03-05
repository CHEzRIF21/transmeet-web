"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findManyBySender = findManyBySender;
exports.findManyPublished = findManyPublished;
exports.findById = findById;
exports.create = create;
exports.updateStatus = updateStatus;
const prisma_js_1 = require("./prisma.js");
async function findManyBySender(senderId, status) {
    return prisma_js_1.prisma.transportRequest.findMany({
        where: {
            senderId,
            ...(status && { status }),
        },
        orderBy: { createdAt: "desc" },
        include: {
            sender: { select: { id: true, full_name: true, email: true, phone: true } },
            missions: {
                take: 1,
                include: { carrier: { select: { full_name: true } } },
            },
        },
    });
}
async function findManyPublished(status) {
    return prisma_js_1.prisma.transportRequest.findMany({
        where: {
            status: status ?? "PUBLISHED",
        },
        orderBy: { createdAt: "desc" },
        include: {
            sender: { select: { id: true, full_name: true, email: true, phone: true } },
            missions: {
                take: 1,
                include: { carrier: { select: { full_name: true } } },
            },
        },
    });
}
async function findById(id) {
    return prisma_js_1.prisma.transportRequest.findUnique({
        where: { id },
        include: {
            sender: true,
            offers: {
                include: {
                    carrier: { select: { id: true, full_name: true, email: true, phone: true } },
                    vehicle: true,
                },
            },
        },
    });
}
async function create(data) {
    return prisma_js_1.prisma.transportRequest.create({
        data: {
            ...data,
            currency: data.currency ?? "XOF",
        },
    });
}
async function updateStatus(id, status) {
    return prisma_js_1.prisma.transportRequest.update({
        where: { id },
        data: { status },
    });
}
//# sourceMappingURL=transport-request.repository.js.map