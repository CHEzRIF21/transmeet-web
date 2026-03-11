import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { LeadType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../repositories/prisma.js";
import { ValidationError } from "../utils/errors.js";

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

const baseLeadRefine = (data: z.infer<typeof baseLeadObject>, ctx: z.RefinementCtx) => {
  const hasContact = (data.email && data.email !== "") || (data.phone && data.phone.length >= 6);
  if (!hasContact) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Téléphone ou email requis",
      path: ["email"],
    });
  }
  const hasIdentity = (data.name && data.name.length >= 2) || (data.company && data.company.length >= 2);
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
    truckTypes: z.array(truckTypeItemSchema).min(1, "Au moins un type de camion requis"),
  })
  .superRefine(baseLeadRefine);

const transporteurSchema = baseLeadObject
  .extend({
    type: z.literal("TRANSPORTEUR"),
    truckTypes: z.array(truckTypeItemSchema).min(1, "Au moins un type de camion requis"),
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

const leadSchema = z.union([
  expediteurSchema,
  transporteurSchema,
  btpSchema,
  contactSchema,
]);

export async function leadsRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  app.post(
    "/",
    async (request, _reply): Promise<{
      success: boolean;
      message: string;
    }> => {
      try {
        const parsed = leadSchema.parse(request.body);

        const { type, name, email, phone, company, message, ...metadata } =
          parsed;

        const cleanName = name?.trim() || undefined;
        const cleanEmail = email?.trim() || undefined;

        await prisma.lead.create({
          data: {
            type: type as LeadType,
            name: cleanName,
            email: cleanEmail,
            phone: phone?.trim() || undefined,
            company: company?.trim() || undefined,
            message: message?.trim() || undefined,
            metadata: Object.keys(metadata).length ? metadata : undefined,
          },
        });

        return {
          success: true,
          message: "Votre demande a bien été prise en compte.",
        };
      } catch (err) {
        if (err instanceof z.ZodError) {
          throw new ValidationError("Données invalides");
        }
        throw err;
      }
    }
  );
}

