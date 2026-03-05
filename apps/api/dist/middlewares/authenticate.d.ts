import type { FastifyRequest, FastifyReply } from "fastify";
export interface AuthenticatedUser {
    id: string;
    email?: string;
    role?: string;
}
declare module "fastify" {
    interface FastifyRequest {
        user?: AuthenticatedUser;
    }
}
export declare function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=authenticate.d.ts.map