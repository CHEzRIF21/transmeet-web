import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ExpediteurMissionsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "expediteur") return null;
  const supabase = await createClient();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  const requestIds = shipper
    ? (await supabase.from("shipment_requests").select("id").eq("shipper_id", shipper.id)).data?.map((r) => r.id) ?? []
    : [];
  const missions =
    requestIds.length > 0
      ? (await supabase
          .from("missions")
          .select("*, shipment_requests(origin_city, dest_city), vehicles(plate_number)")
          .in("request_id", requestIds)
          .order("created_at", { ascending: false })).data ?? []
      : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Missions</h1>
      <p className="mt-2 text-muted-foreground">Suivi des missions liées à vos demandes.</p>
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
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/expediteur/missions/${m.id}`}>Voir le détail</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
