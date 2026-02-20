import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

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
  const { data: mission, error } = await supabase
    .from("missions")
    .select("*, shipment_requests(*), transporters(id, user_id), vehicles(*)")
    .eq("id", id)
    .single();
  if (error || !mission) {
    return NextResponse.json({ success: false, error: "Mission introuvable" }, { status: 404 });
  }
  if (user.role === "admin") {
    return NextResponse.json({ success: true, data: mission });
  }
  if (user.role === "transporteur") {
    const { data: t } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
    if (t?.id !== mission.transporter_id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: mission });
  }
  if (user.role === "expediteur") {
    const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
    const { data: req } = await supabase.from("shipment_requests").select("shipper_id").eq("id", mission.request_id).single();
    if (shipper?.id !== req?.shipper_id) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: mission });
  }
  return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
}
