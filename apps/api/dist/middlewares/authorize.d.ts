import type { FastifyRequest, FastifyReply } from "fastify";
type Role = "expediteur" | "transporteur" | "admin" | "ADMIN" | "EXPEDITEUR" | "TRANSPORTEUR";
export declare function requireRole(...allowedRoles: Role[]): (request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
export declare function requireAdmin(): (request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
export {};
//# sourceMappingURL=authorize.d.ts.map