"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "./api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().min(6, "Téléphone requis"),
  truckType: z.string().min(2, "Type de camion requis"),
  capacity: z.string().min(1, "Capacité requise"),
  zone: z.string().min(2, "Zone d'activité requise"),
  experienceYears: z.string().min(1, "Nombre d'années requis"),
});

type FormValues = z.infer<typeof schema>;

export function TransporteurForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setServerMessage(null);
    setServerError(null);
    try {
      const message = await submitLead({
        type: "TRANSPORTEUR",
        ...values,
      });
      setServerMessage(message);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Erreur inattendue."
      );
    }
  };

  return (
    <Card className="border-primary/10">
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Nom / Raison sociale
              </label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Téléphone
              </label>
              <Input {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Type de camion
              </label>
              <Input {...register("truckType")} />
              {errors.truckType && (
                <p className="text-xs text-red-600">{errors.truckType.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Capacité (T)
              </label>
              <Input {...register("capacity")} />
              {errors.capacity && (
                <p className="text-xs text-red-600">{errors.capacity.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Zone d&apos;activité
              </label>
              <Input {...register("zone")} />
              {errors.zone && (
                <p className="text-xs text-red-600">{errors.zone.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Années d&apos;expérience
              </label>
              <Input {...register("experienceYears")} />
              {errors.experienceYears && (
                <p className="text-xs text-red-600">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>
          </div>

          {serverMessage && (
            <p className="text-sm text-accent">{serverMessage}</p>
          )}
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="accent"
            size="lg"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
