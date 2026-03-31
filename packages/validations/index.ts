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

// ─── Leads (formulaires vitrine → table `leads`) — aligné sur apps/api/src/routes/leads.ts

const truckTypeItemSchema = z.object({
  type: z.string().min(1, "Type de camion requis"),
  quantity: z.number().int().positive("Quantité > 0 requise"),
});

const baseLeadObject = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(6).max(32).optional(),
  company: z.string().min(2).optional(),
  message: z.string().max(2000).optional(),
});

const baseLeadRefine = (
  data: z.infer<typeof baseLeadObject>,
  ctx: z.RefinementCtx
) => {
  const hasContact =
    (data.email && data.email !== "") ||
    (data.phone && data.phone.length >= 6);
  if (!hasContact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Téléphone ou email requis",
      path: ["email"],
    });
  }
  const hasIdentity =
    (data.name && data.name.length >= 2) ||
    (data.company && data.company.length >= 2);
  if (!hasIdentity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nom/prénom ou nom d'entreprise requis",
      path: ["name"],
    });
  }
};

const expediteurSchema = baseLeadObject
  .extend({
    type: z.literal("EXPEDITEUR"),
    departureCity: z.string().min(2, "Ville de départ requise"),
    arrivalCity: z.string().min(2, "Ville d'arrivée requise"),
    truckTypes: z
      .array(truckTypeItemSchema)
      .min(1, "Au moins un type de camion requis"),
  })
  .superRefine(baseLeadRefine);

const transporteurSchema = baseLeadObject
  .extend({
    type: z.literal("TRANSPORTEUR"),
    truckTypes: z
      .array(truckTypeItemSchema)
      .min(1, "Au moins un type de camion requis"),
  })
  .superRefine(baseLeadRefine);

const btpSchema = baseLeadObject
  .extend({
    type: z.literal("BTP"),
    projectType: z.string().min(2),
    equipments: z.array(z.string()).min(1),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine(baseLeadRefine);

const contactSchema = baseLeadObject
  .extend({
    type: z.literal("CONTACT"),
    subject: z.string().min(2),
  })
  .superRefine(baseLeadRefine);

/** Union des payloads acceptés pour POST /api/v1/leads et sauvegarde Prisma directe. */
export const leadSchema = z.union([
  expediteurSchema,
  transporteurSchema,
  btpSchema,
  contactSchema,
]);

export type LeadPayload = z.infer<typeof leadSchema>;
