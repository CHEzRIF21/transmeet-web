import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { vehicleSchema } from "@/validations/vehicle";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "transporteur" && user.role !== "admin")) {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: transporter } = await supabase
    .from("transporters")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!transporter && user.role === "transporteur") {
    return NextResponse.json({ success: true, data: [] });
  }
  const query = supabase.from("vehicles").select("*");
  if (user.role === "transporteur" && transporter?.company_id) {
    query.eq("company_id", transporter.company_id);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data ?? [] });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "transporteur") {
    return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 403 });
  }
  const supabase = await createClient();
  const { data: transporter } = await supabase
    .from("transporters")
    .select("company_id")
    .eq("user_id", user.id)
    .single();
  if (!transporter?.company_id) {
    return NextResponse.json({ success: false, error: "Transporteur ou entreprise introuvable" }, { status: 400 });
  }
  const body = await request.json();
  const parsed = vehicleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  }
  const { error } = await supabase.from("vehicles").insert({
    company_id: transporter.company_id,
    type: parsed.data.type,
    capacity_tons: parsed.data.capacity_tons ?? null,
    plate_number: parsed.data.plate_number,
  });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, message: "Véhicule créé" });
}
