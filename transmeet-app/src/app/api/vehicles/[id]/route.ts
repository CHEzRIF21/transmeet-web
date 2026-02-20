import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { vehicleSchema } from "@/validations/vehicle";

async function getVehicleCompanyId(supabase: Awaited<ReturnType<typeof createClient>>, vehicleId: string) {
  const { data } = await supabase.from("vehicles").select("company_id").eq("id", vehicleId).single();
  return data?.company_id ?? null;
}

async function canEditVehicle(user: Awaited<ReturnType<typeof getCurrentUser>>, supabase: Awaited<ReturnType<typeof createClient>>, vehicleId: string) {
  if (!user || user.role !== "transporteur") return false;
  const { data: transporter } = await supabase.from("transporters").select("company_id").eq("user_id", user.id).single();
  const companyId = await getVehicleCompanyId(supabase, vehicleId);
  return transporter?.company_id === companyId;
}

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const canEdit = await canEditVehicle(user, supabase, id);
  if (!canEdit) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const body = await _request.json();
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const { error } = await supabase
    .from("vehicles")
    .update({
      type: parsed.data.type,
      capacity_tons: parsed.data.capacity_tons ?? null,
      plate_number: parsed.data.plate_number,
    })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Véhicule modifié" });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const canEdit = await canEditVehicle(user, supabase, id);
  if (!canEdit) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Véhicule supprimé" });
}
