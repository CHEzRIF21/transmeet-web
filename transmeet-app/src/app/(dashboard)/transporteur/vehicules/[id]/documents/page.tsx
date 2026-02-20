import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { VehicleDocumentsList } from "./VehicleDocumentsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VehicleDocumentsPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).single();
  if (!vehicle) notFound();
  const { data: transporter } = await supabase.from("transporters").select("company_id").eq("user_id", user.id).single();
  if (transporter?.company_id !== vehicle.company_id) notFound();

  const { data: docs } = await supabase.from("documents").select("id, type, file_url, created_at").eq("vehicle_id", id).order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/transporteur/vehicules/${id}/modifier`}>← Retour au véhicule</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Documents du véhicule</h1>
      </div>
      <div className="space-y-8">
        <section>
          <h2 className="mb-2 font-medium">Ajouter un document</h2>
          <DocumentUpload vehicleId={id} />
        </section>
        <section>
          <h2 className="mb-2 font-medium">Documents déposés</h2>
          <VehicleDocumentsList documents={docs ?? []} />
        </section>
      </div>
    </div>
  );
}
