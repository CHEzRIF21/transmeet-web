"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "./api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "Nom requis"),
  company: z.string().min(2, "Entreprise requise"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone requis"),
  projectType: z.string().min(2, "Type de projet requis"),
  equipments: z.string().min(2, "Engins requis"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function BTPDevisForm() {
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
      const equipmentsArray = values.equipments
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const message = await submitLead({
        type: "BTP",
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        projectType: values.projectType,
        equipments: equipmentsArray,
        startDate: values.startDate,
        endDate: values.endDate,
        message: values.message,
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
                Nom complet
              </label>
              <Input {...register("name")} />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Entreprise
              </label>
              <Input {...register("company")} />
              {errors.company && (
                <p className="text-xs text-red-600">{errors.company.message}</p>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Type de projet
              </label>
              <Input {...register("projectType")} />
              {errors.projectType && (
                <p className="text-xs text-red-600">
                  {errors.projectType.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Engins souhaités
              </label>
              <Input
                placeholder="Ex: pelleteuse, bulldozer, camions bennes..."
                {...register("equipments")}
              />
              {errors.equipments && (
                <p className="text-xs text-red-600">
                  {errors.equipments.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Début estimé
              </label>
              <Input type="date" {...register("startDate")} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Fin estimée
              </label>
              <Input type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Détails complémentaires
            </label>
            <Textarea rows={4} {...register("message")} />
            {errors.message && (
              <p className="text-xs text-red-600">{errors.message.message}</p>
            )}
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
            {isSubmitting ? "Envoi en cours..." : "Demander un devis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
