import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MissionChat } from "@/components/features/MissionChat";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TransporteurMissionMessagesPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  const { data: mission } = await supabase.from("missions").select("id, transporter_id").eq("id", id).single();
  if (!mission || mission.transporter_id !== transporter?.id) notFound();

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("mission_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/transporteur/missions/${id}`}>← Retour à la mission</Link>
        </Button>
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>
      <MissionChat
        missionId={id}
        currentUserId={user.id}
        initialMessages={messages ?? []}
      />
    </div>
  );
}
