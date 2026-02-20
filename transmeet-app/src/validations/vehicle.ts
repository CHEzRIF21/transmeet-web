import { z } from "zod";

export const vehicleSchema = z.object({
  type: z.string().min(1, "Type requis"),
  capacity_tons: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().min(0).optional()
  ),
  plate_number: z.string().min(1, "Immatriculation requise"),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
