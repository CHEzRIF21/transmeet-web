import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { MissionDocumentsList } from "../../MissionDocumentsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TransporteurMissionDocumentsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  const { data: mission } = await supabase.from("missions").select("id, transporter_id").eq("id", id).single();
  if (!mission || mission.transporter_id !== transporter?.id) notFound();

  const { data: docs } = await supabase.from("documents").select("id, type, file_url, created_at").eq("mission_id", id).order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/transporteur/missions/${id}`}>← Retour à la mission</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Documents de la mission</h1>
      </div>
      <div className="space-y-8">
        <section>
          <h2 className="mb-2 font-medium">Ajouter un document</h2>
          <DocumentUpload missionId={id} />
        </section>
        <section>
          <h2 className="mb-2 font-medium">Documents déposés</h2>
          <MissionDocumentsList documents={docs ?? []} />
        </section>
      </div>
    </div>
  );
}
