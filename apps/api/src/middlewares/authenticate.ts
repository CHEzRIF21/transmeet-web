import type { FastifyRequest, FastifyReply } from "fastify";
import { createClient } from "@supabase/supabase-js";
import { UnauthorizedError } from "../utils/errors.js";

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

const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new UnauthorizedError();
  }

  if (!supabase) {
    throw new UnauthorizedError();
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new UnauthorizedError();
  }

  request.user = {
    id: user.id,
    email: user.email ?? undefined,
    role: (user.user_metadata?.role as string) ?? undefined,
  };
}
