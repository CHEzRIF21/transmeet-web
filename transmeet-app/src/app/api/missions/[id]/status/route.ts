import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

const VALID_STATUSES = ["pending", "accepted", "in_transit", "delivered", "completed"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const body = await request.json();
  const newStatus = body?.status;
  if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ success: false, error: "Statut invalide" }, { status: 400 });
  }
  const supabase = await createClient();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  if (!transporter) {
    return NextResponse.json({ success: false, error: "Transporteur introuvable" }, { status: 400 });
  }
  const { data: mission } = await supabase.from("missions").select("id, status, transporter_id").eq("id", id).single();
  if (!mission || mission.transporter_id !== transporter.id) {
    return NextResponse.json({ success: false, error: "Mission introuvable" }, { status: 404 });
  }
  const currentIndex = VALID_STATUSES.indexOf(mission.status as (typeof VALID_STATUSES)[number]);
  const newIndex = VALID_STATUSES.indexOf(newStatus);
  if (newIndex <= currentIndex) {
    return NextResponse.json({ success: false, error: "Statut non autorisé (ordre des étapes)" }, { status: 400 });
  }
  const { error } = await supabase.from("missions").update({ status: newStatus }).eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data: { status: newStatus } });
}
