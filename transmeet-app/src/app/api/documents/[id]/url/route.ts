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
  const { data: doc } = await supabase.from("documents").select("id, file_url, mission_id, vehicle_id").eq("id", id).single();
  if (!doc) return NextResponse.json({ success: false, error: "Document introuvable" }, { status: 404 });

  if (doc.mission_id) {
    const { data: mission } = await supabase.from("missions").select("transporter_id, request_id").eq("id", doc.mission_id).single();
    if (!mission) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
    const { data: tr } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
    const { data: req } = await supabase.from("shipment_requests").select("shipper_id").eq("id", mission.request_id).single();
    const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
    const allowed = tr?.id === mission.transporter_id || shipper?.id === req?.shipper_id;
    if (!allowed) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  } else if (doc.vehicle_id) {
    const { data: vehicle } = await supabase.from("vehicles").select("company_id").eq("id", doc.vehicle_id).single();
    const { data: tr } = await supabase.from("transporters").select("company_id").eq("user_id", user.id).single();
    if (!vehicle || tr?.company_id !== vehicle.company_id) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }

  const { data: signedData, error: signedError } = await supabase.storage.from("documents").createSignedUrl(doc.file_url, 60);
  if (signedError || !signedData?.signedUrl) return NextResponse.json({ success: false, error: signedError?.message ?? "URL introuvable" }, { status: 500 });
  return NextResponse.redirect(signedData.signedUrl);
}
