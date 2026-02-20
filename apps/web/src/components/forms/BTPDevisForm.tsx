"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "./api";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-2xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Nom complet
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Entreprise
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-xs text-red-600">{errors.company.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Téléphone
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("phone")}
          />
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
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("projectType")}
          />
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
          <input
            placeholder="Ex: pelleteuse, bulldozer, camions bennes..."
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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
          <input
            type="date"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("startDate")}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Fin estimée
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("endDate")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Détails complémentaires
        </label>
        <textarea
          rows={4}
          className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-600">{errors.message.message}</p>
        )}
      </div>

      {serverMessage && (
        <p className="text-sm text-emerald-600">{serverMessage}</p>
      )}
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Envoi en cours..." : "Demander un devis"}
      </button>
    </form>
  );
}

