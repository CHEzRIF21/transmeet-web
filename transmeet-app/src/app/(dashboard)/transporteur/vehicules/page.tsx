import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { VehicleActions } from "./VehicleActions";

export default async function VehiculesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: transporter } = await supabase
    .from("transporters")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  const vehicles = transporter?.company_id
    ? (await supabase.from("vehicles").select("*").eq("company_id", transporter.company_id).order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Véhicules</h1>
        <Button asChild>
          <Link href="/dashboard/transporteur/vehicules/nouveau">Ajouter un véhicule</Link>
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.length === 0 ? (
          <p className="text-muted-foreground">Aucun véhicule. Ajoutez-en un pour commencer.</p>
        ) : (
          vehicles.map((v) => (
            <Card key={v.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="font-medium">{v.type}</span>
                <VehicleActions vehicleId={v.id} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {v.plate_number}
                  {v.capacity_tons != null ? ` · ${v.capacity_tons} t` : ""}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/transporteur/vehicules/${v.id}/modifier`}>Modifier</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/transporteur/vehicules/${v.id}/documents`}>Documents</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
