"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpInput } from "@/validations/auth";
import { verifyOtpEmail } from "@/services/authService";
import { createClient } from "@/lib/supabase/client";
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
import { AuthInput } from "@/components/auth/AuthInput";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const EMAIL_SIGNUP_STORAGE_KEY = "transmeet_email_signup_data";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
  });

  const email = emailFromUrl || "";

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  async function onSubmit(values: OtpInput) {
    setError(null);
    setIsLoading(true);

    const { error: verifyError } = await verifyOtpEmail({
      email,
      token: values.token,
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user && typeof window !== "undefined") {
      const stored = sessionStorage.getItem(EMAIL_SIGNUP_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as {
          email: string;
          full_name: string;
          role: "expediteur" | "transporteur";
          company_name: string;
          company_country: string;
        };

        const { data: company } = await supabase
          .from("companies")
          .insert({
            name: data.company_name,
            type: data.role,
            country: data.company_country,
          })
          .select("id")
          .single();

        if (company?.id) {
          await supabase
            .from("profiles")
            .update({
              full_name: data.full_name,
              role: data.role,
              company_id: company.id,
            })
            .eq("id", user.id);

          if (data.role === "expediteur") {
            await supabase.from("shippers").insert({
              user_id: user.id,
              company_id: company.id,
            });
          } else {
            await supabase.from("transporters").insert({
              user_id: user.id,
              company_id: company.id,
            });
          }
        }

        sessionStorage.removeItem(EMAIL_SIGNUP_STORAGE_KEY);
      }
    }

    router.push("/dashboard");
    router.refresh();
    setIsLoading(false);
  }

  if (!email) return null;

  return (
    <div className="w-full">
      <Card className="rounded-2xl border-white/20 bg-white/95 shadow-2xl shadow-black/25 backdrop-blur-md">
        <CardHeader className="space-y-2 pb-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Vérification
          </CardTitle>
          <CardDescription className="text-base">
            Entrez le code à 6 chiffres envoyé à {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code OTP</FormLabel>
                    <FormControl>
                      <AuthInput
                        placeholder="123456"
                        maxLength={6}
                        className="h-12 text-center text-lg tracking-[0.5em] font-mono"
                        {...field}
                        disabled={isLoading}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                    Vérification...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Vérifier
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-white/20 pt-6">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;inscription
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
