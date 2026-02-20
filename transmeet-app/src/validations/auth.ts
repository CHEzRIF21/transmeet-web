import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Au moins 6 caractères"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Au moins 6 caractères"),
    full_name: z.string().min(1, "Nom requis"),
    role: z.enum(["expediteur", "transporteur"]),
    company_name: z.string().optional(),
    company_country: z.string().length(3).optional(),
  })
  .refine(
    (data) =>
      data.role !== "expediteur" &&
      data.role !== "transporteur" ||
      (data.company_name && data.company_name.length >= 1),
    { message: "Nom de l'entreprise requis", path: ["company_name"] }
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
