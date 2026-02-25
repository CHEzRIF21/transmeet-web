"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpInput } from "@/validations/auth";
import { verifyOtp } from "@/services/authService";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const PHONE_SIGNUP_STORAGE_KEY = "transmeet_phone_signup_data";

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFromUrl = searchParams.get("phone");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: { token: "" },
  });

  const phone = phoneFromUrl || "";

  useEffect(() => {
    if (!phone) {
      router.replace("/register");
    }
  }, [phone, router]);

  async function onSubmit(values: OtpInput) {
    setError(null);
    setIsLoading(true);

    const { error: verifyError } = await verifyOtp({
      phone,
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
      const stored = sessionStorage.getItem(PHONE_SIGNUP_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as {
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
              phone: phone,
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

        sessionStorage.removeItem(PHONE_SIGNUP_STORAGE_KEY);
      }
    }

    router.push("/dashboard");
    router.refresh();
    setIsLoading(false);
  }

  if (!phone) return null;

  return (
    <div className="w-full">
      <Card className="border-primary/20 shadow-xl">
        <CardHeader className="space-y-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">Vérification</CardTitle>
          <CardDescription>
            Entrez le code à 6 chiffres envoyé au {phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-lg tracking-[0.5em] font-mono"
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
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
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
