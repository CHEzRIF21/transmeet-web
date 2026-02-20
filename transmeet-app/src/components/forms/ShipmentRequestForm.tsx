"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipmentRequestSchema, requestStatuses, type ShipmentRequestInput } from "@/validations/shipment-request";
import type { ShipmentRequest } from "@/types/database.types";
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

interface ShipmentRequestFormProps {
  defaultValues?: Partial<ShipmentRequest>;
  onSubmit: (values: ShipmentRequestInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function ShipmentRequestForm({ defaultValues, onSubmit, isSubmitting }: ShipmentRequestFormProps) {
  const form = useForm<ShipmentRequestInput>({
    resolver: zodResolver(shipmentRequestSchema),
    defaultValues: defaultValues
      ? {
          origin_city: defaultValues.origin_city,
          origin_country: defaultValues.origin_country,
          dest_city: defaultValues.dest_city,
          dest_country: defaultValues.dest_country,
          status: defaultValues.status ?? "draft",
          weight_kg: defaultValues.weight_kg ?? undefined,
          notes: defaultValues.notes ?? undefined,
        }
      : {
          origin_city: "",
          origin_country: "BEN",
          dest_city: "",
          dest_country: "BEN",
          status: "draft",
          weight_kg: undefined,
          notes: "",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))} className="space-y-4">
        <FormField
          control={form.control}
          name="origin_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville d&apos;origine</FormLabel>
              <FormControl>
                <Input placeholder="Cotonou" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="origin_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays d&apos;origine (code ISO 3)</FormLabel>
              <FormControl>
                <Input placeholder="BEN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dest_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville de destination</FormLabel>
              <FormControl>
                <Input placeholder="Lomé" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dest_country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pays de destination (code ISO 3)</FormLabel>
              <FormControl>
                <Input placeholder="TGO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight_kg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poids (kg)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {defaultValues && (
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    {...field}
                  >
                    {requestStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input placeholder="Optionnel" {...field} />
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
