import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { z } from "zod";
import { prisma } from "../repositories/prisma.js";
import { ValidationError } from "../utils/errors.js";

const baseLeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6).max(32).optional(),
  company: z.string().min(2).optional(),
  message: z.string().min(5).max(2000).optional(),
});

const expediteurSchema = baseLeadSchema.extend({
  type: z.literal("EXPEDITEUR"),
  goodsType: z.string().min(2),
  destination: z.string().min(2),
  truckType: z.string().min(2),
});

const transporteurSchema = baseLeadSchema.extend({
  type: z.literal("TRANSPORTEUR"),
  truckType: z.string().min(2),
  capacity: z.string().min(1),
  zone: z.string().min(2),
  experienceYears: z.string().min(1),
});

const btpSchema = baseLeadSchema.extend({
  type: z.literal("BTP"),
  projectType: z.string().min(2),
  equipments: z.array(z.string()).min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const contactSchema = baseLeadSchema.extend({
  type: z.literal("CONTACT"),
  subject: z.string().min(2),
});

const leadSchema = z.discriminatedUnion("type", [
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
    async (request, reply): Promise<{
      success: boolean;
      message: string;
    }> => {
      try {
        const parsed = leadSchema.parse(request.body);

        const { type, name, email, phone, company, message, ...metadata } =
          parsed;

        await prisma.lead.create({
          data: {
            type,
            name,
            email,
            phone,
            company,
            message,
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

