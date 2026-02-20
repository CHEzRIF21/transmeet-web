import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { shipmentRequestSchema } from "@/validations/shipment-request";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  if (!shipper) {
    return NextResponse.json({ success: true, data: [] });
  }
  const { data, error } = await supabase
    .from("shipment_requests")
    .select("*")
    .eq("shipper_id", shipper.id)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  if (!shipper) {
    return NextResponse.json({ success: false, error: "Profil expéditeur introuvable" }, { status: 400 });
  }
  const body = await request.json();
  const parsed = shipmentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const { error } = await supabase.from("shipment_requests").insert({
    shipper_id: shipper.id,
    origin_city: parsed.data.origin_city,
    origin_country: parsed.data.origin_country,
    dest_city: parsed.data.dest_city,
    dest_country: parsed.data.dest_country,
    status: parsed.data.status ?? "draft",
    weight_kg: parsed.data.weight_kg ?? null,
    notes: parsed.data.notes ?? null,
  });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Demande créée" });
}
