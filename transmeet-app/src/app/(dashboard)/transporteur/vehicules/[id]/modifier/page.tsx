import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { VehicleEditForm } from "./VehicleEditForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierVehiculePage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") return null;
  const supabase = await createClient();
  const { data: vehicle } = await supabase.from("vehicles").select("*").eq("id", id).single();
  if (!vehicle) notFound();
  const { data: transporter } = await supabase.from("transporters").select("company_id").eq("user_id", user.id).single();
  if (transporter?.company_id !== vehicle.company_id) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Modifier le véhicule</h1>
      <div className="max-w-md">
        <VehicleEditForm vehicle={vehicle} />
      </div>
    </div>
  );
}
