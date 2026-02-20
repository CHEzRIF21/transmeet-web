"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleInput } from "@/validations/vehicle";
import type { Vehicle } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface VehicleFormProps {
  defaultValues?: Partial<Vehicle>;
  onSubmit: (values: VehicleInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function VehicleForm({ defaultValues, onSubmit, isSubmitting }: VehicleFormProps) {
  const form = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaultValues
      ? {
          type: defaultValues.type,
          capacity_tons: defaultValues.capacity_tons ?? undefined,
          plate_number: defaultValues.plate_number,
        }
      : { type: "", capacity_tons: undefined, plate_number: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Camion, fourgon…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity_tons"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacité (tonnes)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plate_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="AB-1234-CD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
}
