"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/validations/auth";
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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "expediteur",
      company_name: "",
      company_country: "BEN",
    },
  });

  const role = form.watch("role");

  async function onSubmit(values: RegisterInput) {
    setError(null);
    const supabase = createClient();
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
          role: values.role,
          company_name: values.company_name,
          company_country: values.company_country ?? "BEN",
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (authData.user && (values.role === "expediteur" || values.role === "transporteur")) {
      const { data: company } = await supabase
        .from("companies")
        .insert({
          name: values.company_name ?? values.full_name,
          type: values.role,
          country: values.company_country ?? "BEN",
        })
        .select("id")
        .single();
      if (company?.id) {
        await supabase.from("profiles").update({ company_id: company.id }).eq("id", authData.user.id);
        if (values.role === "expediteur") {
          await supabase.from("shippers").insert({ user_id: authData.user.id, company_id: company.id });
        } else {
          await supabase.from("transporters").insert({ user_id: authData.user.id, company_id: company.id });
        }
      }
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Inscription</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Je suis</FormLabel>
                <FormControl>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    {...field}
                  >
                    <option value="expediteur">Expéditeur</option>
                    <option value="transporteur">Transporteur</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vous@exemple.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {(role === "expediteur" || role === "transporteur") && (
            <>
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l&apos;entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="Ma Société" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays (code ISO 3)</FormLabel>
                    <FormControl>
                      <Input placeholder="BEN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            S&apos;inscrire
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
