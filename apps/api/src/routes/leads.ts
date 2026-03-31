import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import type { LeadType } from "@prisma/client";
import { z } from "zod";
import { leadSchema } from "@transmit/validations";
import { prisma } from "../repositories/prisma.js";
import { ValidationError } from "../utils/errors.js";

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
