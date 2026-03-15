"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "./api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const TRUCK_TYPES = [
  "Plateau 20'",
  "Plateau 40'",
  "Porte-char",
  "Semi-remorque",
  "Pelle",
  "Tractopelle",
  "Bulldozer",
  "Chargeuse",
  "Niveleuse",
  "Grue mobile PPM",
  "Chariot élévateur",
  "Benne",
  "Citerne",
  "Camion frigorifique",
  "Autre",
] as const;

const schema = z
  .object({
    profileType: z.enum(["particulier", "entreprise"]),
    name: z.string().optional(),
    company: z.string().optional(),
    phone: z.string().min(6, "Téléphone requis"),
    email: z.string().email("Email invalide"),
    departureCity: z.string().min(2, "Ville de départ requise"),
    arrivalCity: z.string().min(2, "Ville d'arrivée requise"),
    truckTypes: z
      .array(
        z.object({
          type: z.string().min(1, "Type requis"),
          quantity: z.coerce.number().int().positive("Quantité > 0 requise"),
        })
      )
      .min(1, "Au moins un type de camion requis"),
    message: z.string().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.profileType === "particulier") {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nom et prénom requis",
          path: ["name"],
        });
      }
    } else {
      if (!data.name || data.name.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nom et prénom de la personne requis",
          path: ["name"],
        });
      }
      if (!data.company || data.company.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nom de l'entreprise requis",
          path: ["company"],
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

export function ExpediteurForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileType: "particulier",
      truckTypes: [{ type: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "truckTypes",
  });

  const profileType = watch("profileType");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setServerMessage(null);
    setServerError(null);
    try {
      const message = await submitLead({
        type: "EXPEDITEUR",
        name: values.name,
        company: values.profileType === "entreprise" ? values.company : undefined,
        phone: values.phone,
        email: values.email,
        departureCity: values.departureCity,
        arrivalCity: values.arrivalCity,
        truckTypes: values.truckTypes,
        message: values.message || undefined,
      });
      setServerMessage(message);
      reset({
        profileType: "particulier",
        truckTypes: [{ type: "", quantity: 1 }],
      });
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Êtes-vous une entreprise ou un particulier ?
            </label>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="particulier"
                  {...register("profileType")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Particulier</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="entreprise"
                  {...register("profileType")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Entreprise</span>
              </label>
            </div>
          </div>

          {profileType === "particulier" ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Nom et prénom
              </label>
              <Input
                placeholder="Ex: Jean Dupont"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Nom et prénom de la personne
                </label>
                <Input
                  placeholder="Ex: Jean Dupont"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">
                  Nom de l&apos;entreprise
                </label>
                <Input
                  placeholder="Ex: Transport SA"
                  {...register("company")}
                />
                {errors.company && (
                  <p className="text-xs text-red-600">{errors.company.message}</p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Téléphone
              </label>
              <Input
                type="tel"
                placeholder="+229 00 00 00 00"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Adresse email
              </label>
              <Input
                type="email"
                placeholder="contact@exemple.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Types de camions
            </label>
            <p className="text-xs text-muted-foreground">
              Choisissez un ou plusieurs types et indiquez la quantité pour
              chacun.
            </p>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-end sm:gap-3"
              >
                <div className="flex-1 space-y-1">
                  <select
                    {...register(`truckTypes.${index}.type`)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Sélectionner un type</option>
                    {TRUCK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.truckTypes?.[index]?.type && (
                    <p className="text-xs text-red-600">
                      {errors.truckTypes[index]?.type?.message}
                    </p>
                  )}
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-24 space-y-1">
                    <label className="sr-only">Quantité</label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Nb"
                      {...register(`truckTypes.${index}.quantity`)}
                    />
                    {errors.truckTypes?.[index]?.quantity && (
                      <p className="text-xs text-red-600">
                        {errors.truckTypes[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: "", quantity: 1 })}
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un type
            </Button>
            {errors.truckTypes?.message && typeof errors.truckTypes.message === "string" && (
              <p className="text-xs text-red-600">{errors.truckTypes.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Ville de départ
              </label>
              <Input
                placeholder="Ex: Cotonou"
                {...register("departureCity")}
              />
              {errors.departureCity && (
                <p className="text-xs text-red-600">
                  {errors.departureCity.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Ville d&apos;arrivée
              </label>
              <Input
                placeholder="Ex: Lomé"
                {...register("arrivalCity")}
              />
              {errors.arrivalCity && (
                <p className="text-xs text-red-600">
                  {errors.arrivalCity.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Espace pour préciser vos besoins
            </label>
            <Textarea
              rows={4}
              placeholder="Décrivez votre demande de transport..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-red-600">{errors.message.message}</p>
            )}
          </div>

          {serverMessage && (
            <p className="text-sm text-accent">{serverMessage}</p>
          )}
          {serverError && (
            <p className="text-sm text-red-600">{serverError}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="accent"
            size="lg"
          >
            {isSubmitting ? "Envoi en cours..." : "Démarrer le devis"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
