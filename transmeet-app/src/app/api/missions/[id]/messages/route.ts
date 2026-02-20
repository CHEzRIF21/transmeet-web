import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: missionId } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: mission } = await supabase.from("missions").select("id, transporter_id, request_id").eq("id", missionId).single();
  if (!mission) {
    return NextResponse.json({ success: false, error: "Mission introuvable" }, { status: 404 });
  }
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  const { data: req } = await supabase.from("shipment_requests").select("shipper_id").eq("id", mission.request_id).single();
  const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
  const isParticipant =
    (transporter?.id === mission.transporter_id) || (shipper?.id === req?.shipper_id);
  if (!isParticipant) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("mission_id", missionId)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data: data ?? [] });
}
