"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProfile } from "@/hooks/useProfile";
import { useCreateTransportRequest } from "@/lib/api/transport-requests";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

const schema = z.object({
  originCity: z.string().min(1, "Ville requise"),
  originCountry: z.string().length(3, "Code pays 3 lettres").default("BEN"),
  destCity: z.string().min(1, "Ville requise"),
  destCountry: z.string().length(3, "Code pays 3 lettres").default("BEN"),
  goodsType: z.string().min(1, "Type de marchandise requis"),
  weightTons: z.coerce.number().positive("Tonnage > 0"),
  volumeM3: z.coerce.number().positive().optional(),
  pickupDate: z.string().min(1, "Date requise"),
  proposedPrice: z.coerce.number().nonnegative("Budget >= 0"),
  specialNotes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NouvelleDemandePage() {
  const router = useRouter();
  const { accessToken } = useProfile();
  const createMutation = useCreateTransportRequest(accessToken);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      originCountry: "BEN",
      destCountry: "BEN",
      pickupDate: new Date().toISOString().slice(0, 10),
    },
  });

  async function onSubmit(data: FormValues) {
    if (!accessToken) return;
    const res = await createMutation.mutateAsync(data as unknown as Record<string, unknown>);
    if (res.success && res.data && typeof res.data === "object" && "id" in res.data) {
      router.push(`/expediteur/demandes/${(res.data as { id: string }).id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/expediteur/demandes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
          Nouvelle demande de transport
        </h1>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            Remplissez les champs ci-dessous pour publier votre demande.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="originCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville de départ</FormLabel>
                      <FormControl>
                        <Input placeholder="Cotonou" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays de départ (ISO 3)</FormLabel>
                      <FormControl>
                        <Input placeholder="BEN" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville d&apos;arrivée</FormLabel>
                      <FormControl>
                        <Input placeholder="Lomé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays d&apos;arrivée (ISO 3)</FormLabel>
                      <FormControl>
                        <Input placeholder="TGO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="goodsType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de camion / marchandise</FormLabel>
                    <FormControl>
                      <Input placeholder="Plateau 20T, conteneur, frigo..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="weightTons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tonnage (tonnes)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="volumeM3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume (m³) optionnel</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pickupDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de chargement souhaitée</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="proposedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget proposé (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes / précisions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instructions particulières, conditionnement..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="font-semibold"
                  style={{ backgroundColor: GOLD, color: NAVY }}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Publication..." : "Publier la demande"}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/expediteur/demandes">Annuler</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
