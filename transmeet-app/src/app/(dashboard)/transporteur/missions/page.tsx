import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function TransporteurMissionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  const missions = transporter
    ? (await supabase
        .from("missions")
        .select("*, shipment_requests(origin_city, dest_city, origin_country, dest_country), vehicles(type, plate_number)")
        .eq("transporter_id", transporter.id)
        .order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Missions</h1>
      <p className="mt-2 text-muted-foreground">Vos missions assignées. Acceptez-les pour les démarrer.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {missions.length === 0 ? (
          <p className="text-muted-foreground">Aucune mission pour le moment.</p>
        ) : (
          missions.map((m: { id: string; status: string; shipment_requests: { origin_city: string; dest_city: string } | null; vehicles: { plate_number: string } | null }) => (
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
                  <Link href={`/dashboard/transporteur/missions/${m.id}`}>Voir / Accepter</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
