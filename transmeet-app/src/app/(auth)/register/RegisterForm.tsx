"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus, Package, Truck } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const roleFromUrl = searchParams.get("role") as "expediteur" | "transporteur" | null;
  const initialRole = roleFromUrl === "transporteur" ? "transporteur" : "expediteur";

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: initialRole,
      company_name: "",
      company_country: "BEN",
    },
  });

  useEffect(() => {
    if (roleFromUrl && (roleFromUrl === "expediteur" || roleFromUrl === "transporteur")) {
      form.setValue("role", roleFromUrl);
    }
  }, [roleFromUrl, form]);

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
    <div className="w-full">
      <Card className="border-primary/20 shadow-xl">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
          <CardDescription>
            Créez votre compte Transmeet pour accéder à la plateforme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Je suis</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === "expediteur" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => field.onChange("expediteur")}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Expéditeur
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "transporteur" ? "default" : "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={() => field.onChange("transporteur")}
                        >
                          <Truck className="mr-2 h-4 w-4" />
                          Transporteur
                        </Button>
                      </div>
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
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                S&apos;inscrire
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
