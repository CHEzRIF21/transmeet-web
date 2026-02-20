import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

const ALLOWED_TYPES = ["assurance", "licence", "transport"] as const;
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;
  const mission_id = formData.get("mission_id") as string | null;
  const vehicle_id = formData.get("vehicle_id") as string | null;

  if (!file || !type || !ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ success: false, error: "Fichier et type (assurance, licence, transport) requis" }, { status: 400 });
  }
  if ((mission_id && vehicle_id) || (!mission_id && !vehicle_id)) {
    return NextResponse.json({ success: false, error: "Préciser mission_id ou vehicle_id (un seul)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
  }

  const supabase = await createClient();
  if (mission_id) {
    const { data: mission } = await supabase.from("missions").select("transporter_id, request_id").eq("id", mission_id).single();
    if (!mission) return NextResponse.json({ success: false, error: "Mission introuvable" }, { status: 404 });
    const { data: tr } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
    const { data: req } = await supabase.from("shipment_requests").select("shipper_id").eq("id", mission.request_id).single();
    const { data: shipper } = await supabase.from("shippers").select("id").eq("user_id", user.id).single();
    const allowed = tr?.id === mission.transporter_id || shipper?.id === req?.shipper_id;
    if (!allowed) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  } else if (vehicle_id) {
    const { data: vehicle } = await supabase.from("vehicles").select("company_id").eq("id", vehicle_id).single();
    if (!vehicle) return NextResponse.json({ success: false, error: "Véhicule introuvable" }, { status: 404 });
    const { data: tr } = await supabase.from("transporters").select("company_id").eq("user_id", user.id).single();
    if (tr?.company_id !== vehicle.company_id) return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }

  const path = `${mission_id ?? vehicle_id}/${type}/${Date.now()}-${file.name}`;
  const buf = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage.from("documents").upload(path, buf, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({
      mission_id: mission_id || null,
      vehicle_id: vehicle_id || null,
      type: type as "assurance" | "licence" | "transport",
      file_url: path,
      uploaded_by: user.id,
    })
    .select("id, type, file_url, created_at")
    .single();
  if (insertError) return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  return NextResponse.json({ success: true, data: doc });
}
