import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/config";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
/** Destinataire des leads. En sandbox Resend : utiliser l'email de votre compte Resend. */
const LEADS_EMAIL = process.env.LEADS_EMAIL ?? CONTACT_EMAIL;
/** Expéditeur : doit être une adresse du domaine vérifié dans Resend (ex. noreply@trans-meet.com). */
const RESEND_FROM =
  process.env.RESEND_FROM ?? "Transmeet <noreply@trans-meet.com>";

function formatValue(v: unknown): string {
  if (Array.isArray(v)) {
    const isTruckTypes =
      v.length > 0 &&
      typeof v[0] === "object" &&
      v[0] !== null &&
      "type" in (v[0] as object) &&
      "quantity" in (v[0] as object);
    if (isTruckTypes) {
      return (v as { type: string; quantity: number }[])
        .map((item) => `${item.type} x${item.quantity}`)
        .join(", ");
    }
    return v.map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item))).join(", ");
  }
  if (typeof v === "object" && v !== null) {
    return JSON.stringify(v);
  }
  return String(v ?? "");
}

function formatLeadEmail(payload: Record<string, unknown>): string {
  const labels: Record<string, string> = {
    type: "Type",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    company: "Entreprise",
    message: "Message",
    departureCity: "Ville de départ",
    arrivalCity: "Ville d'arrivée",
    truckTypes: "Types de camions",
    subject: "Sujet",
  };
  return Object.entries(payload)
    .map(([k, v]) => `${labels[k] ?? k}: ${formatValue(v)}`)
    .filter((line) => !line.endsWith(": "))
    .join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const type = (payload.type as string) || "CONTACT";
        const { error } = await resend.emails.send({
          from: RESEND_FROM,
          to: LEADS_EMAIL,
          subject: `[Transmeet] Nouvelle lead ${type} - ${(payload.name as string) ?? (payload.company as string) ?? "Sans nom"}`,
          text: formatLeadEmail(payload),
        });
        if (error) {
          console.error("[Resend] Erreur envoi email lead:", error);
        }
      } catch (err) {
        console.error("[Resend] Exception envoi email:", err);
        // Ne pas bloquer : la lead sera quand même enregistrée côté API
      }
    }

    if (process.env.LEADS_WEBHOOK_URL) {
      try {
        await fetch(process.env.LEADS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // Ne pas bloquer le flux si le webhook échoue
      }
    }

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/api/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Impossible de joindre l’API (vérifiez que le backend tourne et NEXT_PUBLIC_API_URL).",
        },
        { status: 503 }
      );
    }

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      const apiMessage = errData.message ?? errData.error ?? "Erreur serveur";
      return NextResponse.json(
        { success: false, message: apiMessage },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { success: boolean; message?: string };
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
