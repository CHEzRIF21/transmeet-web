import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DemandEditForm } from "./DemandEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DemandeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "expediteur") return null;
  const supabase = await createClient();
  const { data: request } = await supabase.from("shipment_requests").select("*").eq("id", id).single();
  if (!request) notFound();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  if (shipper?.id !== request.shipper_id) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/expediteur/demandes">← Retour</Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          Demande {request.origin_city} → {request.dest_city}
        </h1>
      </div>
      <div className="max-w-md">
        <DemandEditForm request={request} />
      </div>
    </div>
  );
}
