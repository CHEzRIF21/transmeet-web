import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function DemandesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "expediteur") return null;
  const supabase = await createClient();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  const requests = shipper
    ? (await supabase.from("shipment_requests").select("*").eq("shipper_id", shipper.id).order("created_at", { ascending: false })).data ?? []
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mes demandes</h1>
        <Button asChild>
          <Link href="/dashboard/expediteur/demandes/nouvelle">Nouvelle demande</Link>
        </Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.length === 0 ? (
          <p className="text-muted-foreground">Aucune demande. Créez-en une pour commencer.</p>
        ) : (
          requests.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <span className="font-medium">{r.origin_city} → {r.dest_city}</span>
                <span className="text-xs text-muted-foreground">{r.status}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {r.origin_country} → {r.dest_country}
                  {r.weight_kg != null ? ` · ${r.weight_kg} kg` : ""}
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href={`/dashboard/expediteur/demandes/${r.id}`}>Voir / Modifier</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
