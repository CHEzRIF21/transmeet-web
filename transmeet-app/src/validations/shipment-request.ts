import { z } from "zod";

export const requestStatuses = ["draft", "published", "matched", "in_progress", "completed", "cancelled"] as const;

export const shipmentRequestSchema = z.object({
  origin_city: z.string().min(1, "Ville d'origine requise"),
  origin_country: z.string().length(3, "Pays (code ISO 3)"),
  dest_city: z.string().min(1, "Ville de destination requise"),
  dest_country: z.string().length(3, "Pays (code ISO 3)"),
  status: z.enum(requestStatuses).default("draft"),
  weight_kg: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().min(0).optional()
  ),
  notes: z.string().optional(),
});

export type ShipmentRequestInput = z.infer<typeof shipmentRequestSchema>;
