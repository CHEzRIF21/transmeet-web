/**
 * Schémas Zod partagés frontend/backend
 */
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["EXPEDITEUR", "TRANSPORTEUR"]),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const otpSchema = z.object({
  code: z.string().length(6),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
