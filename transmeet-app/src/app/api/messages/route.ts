import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const body = await request.json();
  const { mission_id, content } = body;
  if (!mission_id || typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ success: false, error: "mission_id et content requis" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data: mission } = await supabase.from("missions").select("id, transporter_id, request_id").eq("id", mission_id).single();
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
  const { data: inserted, error } = await supabase
    .from("messages")
    .insert({ mission_id, sender_id: user.id, content: content.trim() })
    .select("id, content, created_at, sender_id")
    .single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const { data: missionRow } = await supabase.from("missions").select("transporter_id, request_id").eq("id", mission_id).single();
  if (missionRow) {
    const { data: tr } = await supabase.from("transporters").select("user_id").eq("id", missionRow.transporter_id).single();
    const { data: reqRow } = await supabase.from("shipment_requests").select("shipper_id").eq("id", missionRow.request_id).single();
    const { data: shipperRow } = reqRow ? await supabase.from("shippers").select("user_id").eq("id", reqRow.shipper_id).single() : { data: null };
    const recipientId = user.id === tr?.user_id ? shipperRow?.user_id : tr?.user_id;
    if (recipientId) {
      await supabase.from("notifications").insert({
        user_id: recipientId,
        type: "message",
        title: "Nouveau message",
        body: content.trim().slice(0, 100),
        metadata: { mission_id },
      });
    }
  }

  return NextResponse.json({ success: true, data: inserted });
}
