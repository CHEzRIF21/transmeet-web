import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../repositories/prisma.js";
import { UnauthorizedError } from "../utils/errors.js";

type Role = "expediteur" | "transporteur" | "admin" | "ADMIN" | "EXPEDITEUR" | "TRANSPORTEUR";

export function requireRole(...allowedRoles: Role[]) {
  const normalized = new Set(allowedRoles.map((r) => r.toUpperCase()));

  return async function (request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    if (!request.user?.id) {
      throw new UnauthorizedError();
    }

    const profile = await prisma.profile.findUnique({
      where: { id: request.user.id },
      select: { role: true },
    });

    if (!profile) {
      throw new UnauthorizedError();
    }

    const userRole = profile.role?.toUpperCase() ?? "";
    if (!normalized.has(userRole)) {
      throw new UnauthorizedError();
    }
  };
}

export function requireAdmin() {
  return requireRole("admin", "ADMIN");
}
