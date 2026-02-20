import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { shipmentRequestSchema } from "@/validations/shipment-request";

async function getShipperIdForRequest(supabase: Awaited<ReturnType<typeof createClient>>, requestId: string) {
  const { data } = await supabase.from("shipment_requests").select("shipper_id").eq("id", requestId).single();
  return data?.shipper_id ?? null;
}

async function canEditRequest(user: Awaited<ReturnType<typeof getCurrentUser>>, supabase: Awaited<ReturnType<typeof createClient>>, requestId: string) {
  if (!user) return false;
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  const shipperId = await getShipperIdForRequest(supabase, requestId);
  return shipper?.id === shipperId;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("shipment_requests").select("*").eq("id", id).single();
  if (error || !data) {
    return NextResponse.json({ success: false, error: "Demande introuvable" }, { status: 404 });
  }
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  if (shipper?.id !== data.shipper_id && user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  return NextResponse.json({ success: true, data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const canEdit = await canEditRequest(user, supabase, id);
  if (!canEdit) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const body = await request.json();
  const parsed = shipmentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const { error } = await supabase
    .from("shipment_requests")
    .update({
      origin_city: parsed.data.origin_city,
      origin_country: parsed.data.origin_country,
      dest_city: parsed.data.dest_city,
      dest_country: parsed.data.dest_country,
      status: parsed.data.status,
      weight_kg: parsed.data.weight_kg ?? null,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Demande modifiée" });
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
  const canEdit = await canEditRequest(user, supabase, id);
  if (!canEdit) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const { error } = await supabase.from("shipment_requests").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Demande supprimée" });
}
