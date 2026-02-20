import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateMissionForm } from "./CreateMissionForm";

export default async function AdminMissionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  const supabase = await createClient();
  const { data: missions } = await supabase
    .from("missions")
    .select("*, shipment_requests(origin_city, dest_city), vehicles(plate_number)")
    .order("created_at", { ascending: false });

  const { data: requests } = await supabase
    .from("shipment_requests")
    .select("id, origin_city, dest_city")
    .eq("status", "published");
  const { data: transporters } = await supabase.from("transporters").select("id, user_id");
  const { data: vehicles } = await supabase.from("vehicles").select("id, plate_number, type, company_id");

  return (
    <div>
      <h1 className="text-2xl font-semibold">Missions (admin)</h1>
      <p className="mt-2 text-muted-foreground">Attribuer une demande à un transporteur et un véhicule.</p>

      <div className="mt-6">
        <h2 className="mb-2 font-medium">Créer une mission</h2>
        <CreateMissionForm
          requests={requests ?? []}
          transporters={transporters ?? []}
          vehicles={vehicles ?? []}
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-medium">Toutes les missions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(missions ?? []).map((m: { id: string; status: string; shipment_requests: { origin_city: string; dest_city: string } | null; vehicles: { plate_number: string } | null }) => (
            <Card key={m.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="font-medium">
                  {m.shipment_requests && "origin_city" in m.shipment_requests
                    ? `${(m.shipment_requests as { origin_city: string }).origin_city} → ${(m.shipment_requests as { dest_city: string }).dest_city}`
                    : "Mission"}
                </span>
                <span className="text-xs text-muted-foreground">{m.status}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {m.vehicles && "plate_number" in m.vehicles ? (m.vehicles as { plate_number: string }).plate_number : ""}
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href={`/dashboard/admin/missions/${m.id}`}>Voir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
