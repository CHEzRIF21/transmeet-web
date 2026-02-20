import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: transporter } = await supabase.from("transporters").select("id").eq("user_id", user.id).single();
  if (!transporter) {
    return NextResponse.json({ success: false, error: "Transporteur introuvable" }, { status: 400 });
  }
  const { data: mission } = await supabase.from("missions").select("id, status, transporter_id").eq("id", id).single();
  if (!mission || mission.transporter_id !== transporter.id) {
    return NextResponse.json({ success: false, error: "Mission introuvable ou non assignée à vous" }, { status: 404 });
  }
  if (mission.status !== "pending") {
    return NextResponse.json({ success: false, error: "Mission déjà acceptée ou traitée" }, { status: 400 });
  }
  const { error } = await supabase.from("missions").update({ status: "accepted" }).eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Mission acceptée" });
}
