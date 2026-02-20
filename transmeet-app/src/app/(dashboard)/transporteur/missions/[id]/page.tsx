import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AcceptMissionButton } from "./AcceptMissionButton";
import { MissionTimeline } from "@/components/features/MissionTimeline";
import { MissionStatusUpdate } from "./MissionStatusUpdate";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: mission } = await supabase
    .from("missions")
    .select("*, shipment_requests(*), vehicles(*)")
    .eq("id", id)
    .single();
  if (!mission) notFound();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  if (transporter?.id !== mission.transporter_id) notFound();

  const req = mission.shipment_requests as { origin_city: string; dest_city: string; origin_country: string; dest_country: string } | null;
  const vehicle = mission.vehicles as { type: string; plate_number: string } | null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transporteur/missions">← Retour</Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          Mission {req ? `${req.origin_city} → ${req.dest_city}` : id}
        </h1>
      </div>
      <div className="space-y-4">
        <MissionTimeline status={mission.status} />
        {req && (
          <p>
            <strong>Trajet:</strong> {req.origin_city} ({req.origin_country}) → {req.dest_city} ({req.dest_country})
          </p>
        )}
        {vehicle && (
          <p><strong>Véhicule:</strong> {vehicle.type} — {vehicle.plate_number}</p>
        )}
        {mission.status === "pending" && (
          <AcceptMissionButton missionId={mission.id} />
        )}
        {mission.status !== "pending" && mission.status !== "completed" && (
          <MissionStatusUpdate missionId={mission.id} currentStatus={mission.status} />
        )}
        <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/transporteur/missions/${id}/messages`}>Messagerie</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/transporteur/missions/${id}/documents`}>Documents</Link>
        </Button>
      </div>
      </div>
    </div>
  );
}
