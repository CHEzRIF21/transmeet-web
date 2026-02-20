import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();

  if (user.role === "admin") {
    const { data, error } = await supabase
      .from("missions")
      .select("*, shipment_requests(*), transporters(id, user_id), vehicles(*)")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
  }

  if (user.role === "transporteur") {
    const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
    if (!transporter) return NextResponse.json({ success: true, data: [] });
    const { data, error } = await supabase
      .from("missions")
      .select("*, shipment_requests(*), vehicles(*)")
      .eq("transporter_id", transporter.id)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
  }

  if (user.role === "expediteur") {
    const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
    if (!shipper) return NextResponse.json({ success: true, data: [] });
    const { data: requests } = await supabase.from("shipment_requests").select("id").eq("shipper_id", shipper.id);
    const requestIds = (requests ?? []).map((r) => r.id);
    if (requestIds.length === 0) return NextResponse.json({ success: true, data: [] });
    const { data, error } = await supabase
      .from("missions")
      .select("*, shipment_requests(*), transporters(id, user_id), vehicles(*)")
      .in("request_id", requestIds)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data: data ?? [] });
  }

  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Réservé à l'admin" }, { status: 403 });
  }
  const body = await request.json();
  const { request_id, transporter_id, vehicle_id } = body;
  if (!request_id || !transporter_id || !vehicle_id) {
    return NextResponse.json({ success: false, error: "request_id, transporter_id et vehicle_id requis" }, { status: 400 });
  }
  const supabase = await createClient();
  const { error } = await supabase.from("missions").insert({
    request_id,
    transporter_id,
    vehicle_id,
    status: "pending",
  });
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Mission créée" });
}
