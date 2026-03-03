"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignupSchema, type EmailSignupInput } from "@/validations/auth";
import { signInWithOtpEmail } from "@/services/authService";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { UserPlus, Package, Truck, Mail } from "lucide-react";

const EMAIL_SIGNUP_STORAGE_KEY = "transmeet_email_signup_data";

export function PhoneSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roleFromUrl = searchParams.get("role") as "expediteur" | "transporteur" | null;
  const initialRole = roleFromUrl === "transporteur" ? "transporteur" : "expediteur";

  const form = useForm<EmailSignupInput>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      email: "",
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

  async function onSubmit(values: EmailSignupInput) {
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await signInWithOtpEmail(values.email, {
      shouldCreateUser: true,
      data: {
        full_name: values.full_name,
        role: values.role,
        company_name: values.company_name ?? values.full_name,
        company_country: values.company_country ?? "BEN",
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        EMAIL_SIGNUP_STORAGE_KEY,
        JSON.stringify({
          email: values.email,
          full_name: values.full_name,
          role: values.role,
          company_name: values.company_name ?? values.full_name,
          company_country: values.company_country ?? "BEN",
        })
      );
    }

    router.push(`/register/verify?email=${encodeURIComponent(values.email)}`);
    setIsLoading(false);
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                      <Input placeholder="Jean Dupont" {...field} disabled={isLoading} />
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="vous@exemple.com"
                          className="pl-9"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
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
                          <Input placeholder="Ma Société" {...field} disabled={isLoading} />
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
                          <Input placeholder="BEN" {...field} disabled={isLoading} />
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Envoi du code...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Recevoir le code par email
                  </>
                )}
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
