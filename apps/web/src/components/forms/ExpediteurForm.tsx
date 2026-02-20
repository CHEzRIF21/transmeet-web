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
  goodsType: z.string().min(2, "Type de marchandise requis"),
  destination: z.string().min(2, "Destination requise"),
  truckType: z.string().min(2, "Type de camion requis"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ExpediteurForm() {
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
        type: "EXPEDITEUR",
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1 sm:col-span-1">
          <label className="text-sm font-medium text-foreground">
            Type de marchandise
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("goodsType")}
          />
          {errors.goodsType && (
            <p className="text-xs text-red-600">{errors.goodsType.message}</p>
          )}
        </div>
        <div className="space-y-1 sm:col-span-1">
          <label className="text-sm font-medium text-foreground">
            Destination
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("destination")}
          />
          {errors.destination && (
            <p className="text-xs text-red-600">
              {errors.destination.message}
            </p>
          )}
        </div>
        <div className="space-y-1 sm:col-span-1">
          <label className="text-sm font-medium text-foreground">
            Type de camion souhaité
          </label>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            {...register("truckType")}
          />
          {errors.truckType && (
            <p className="text-xs text-red-600">{errors.truckType.message}</p>
          )}
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
        {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
      </button>
    </form>
  );
}

