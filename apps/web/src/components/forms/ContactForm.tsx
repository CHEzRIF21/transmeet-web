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
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Téléphone requis").optional(),
  subject: z.string().min(2, "Sujet requis"),
  message: z.string().min(5, "Message trop court"),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
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
        type: "CONTACT",
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
                Nom complet
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
                Téléphone (optionnel)
              </label>
              <Input {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Sujet</label>
              <Input {...register("subject")} />
              {errors.subject && (
                <p className="text-xs text-red-600">{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Message / besoin
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
            {isSubmitting ? "Envoi en cours..." : "Envoyer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
