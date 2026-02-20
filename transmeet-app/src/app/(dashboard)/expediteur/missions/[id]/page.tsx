import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MissionTimeline } from "@/components/features/MissionTimeline";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ExpediteurMissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "expediteur") return null;
  const supabase = await createClient();
  const { data: mission } = await supabase
    .from("missions")
    .select("*, shipment_requests(*), vehicles(*)")
    .eq("id", id)
    .single();
  if (!mission) notFound();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  const { data: req } = await supabase.from("shipment_requests").select("shipper_id").eq("id", mission.request_id).single();
  if (shipper?.id !== req?.shipper_id) notFound();

  const reqInfo = mission.shipment_requests as { origin_city: string; dest_city: string; origin_country: string; dest_country: string } | null;
  const vehicle = mission.vehicles as { type: string; plate_number: string } | null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/expediteur/missions">← Retour</Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          Mission {reqInfo ? `${reqInfo.origin_city} → ${reqInfo.dest_city}` : id}
        </h1>
      </div>
      <div className="space-y-4">
        <MissionTimeline status={mission.status} />
        <p><strong>Statut:</strong> {mission.status}</p>
        {reqInfo && (
          <p>Trajet: {reqInfo.origin_city} ({reqInfo.origin_country}) → {reqInfo.dest_city} ({reqInfo.dest_country})</p>
        )}
        {vehicle && <p>Véhicule: {vehicle.type} — {vehicle.plate_number}</p>}
        <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/expediteur/missions/${id}/messages`}>Messagerie</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/expediteur/missions/${id}/documents`}>Documents</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
