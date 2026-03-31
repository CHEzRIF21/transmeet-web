import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/config";

/**
 * URL de l'API Fastify (Prisma / table `leads`).
 * - En local : http://localhost:4000
 * - Sur Vercel : obligatoire — utiliser NEXT_PUBLIC_API_URL ou API_URL (serveur uniquement).
 *   Sans cela, le fetch pointe vers localhost sur le serveur Vercel et l'enregistrement échoue.
 */
const API_BASE =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const LEADS_EMAIL = process.env.LEADS_EMAIL ?? CONTACT_EMAIL;
const RESEND_FROM =
  process.env.RESEND_FROM ?? "Transmeet <noreply@trans-meet.com>";

if (process.env.VERCEL === "1" && !process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL) {
  console.error(
    "[Leads] Définir API_URL ou NEXT_PUBLIC_API_URL (URL publique Fastify/Railway). Sinon les leads ne s'enregistrent pas."
  );
}

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
    return v
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item) : String(item)
      )
      .join(", ");
  }
  if (typeof v === "object" && v !== null) {
    return JSON.stringify(v);
  }
  return String(v ?? "");
}

function formatLeadEmail(payload: Record<string, unknown>): string {
  const labels: Record<string, string> = {
    type: "Type de demande",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    company: "Entreprise",
    message: "Message",
    departureCity: "Ville de départ",
    arrivalCity: "Ville d'arrivée",
    truckTypes: "Types de camions",
    subject: "Sujet",
    projectType: "Type de projet",
    equipments: "Engins souhaités",
    startDate: "Début estimé",
    endDate: "Fin estimée",
  };
  return Object.entries(payload)
    .map(([k, v]) => `${labels[k] ?? k}: ${formatValue(v)}`)
    .filter((line) => !line.endsWith(": "))
    .join("\n");
}

function buildHtmlEmail(payload: Record<string, unknown>): string {
  const labels: Record<string, string> = {
    type: "Type de demande",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    company: "Entreprise",
    message: "Message",
    departureCity: "Ville de départ",
    arrivalCity: "Ville d'arrivée",
    truckTypes: "Types de camions",
    subject: "Sujet",
    projectType: "Type de projet",
    equipments: "Engins souhaités",
    startDate: "Début estimé",
    endDate: "Fin estimée",
  };

  const rows = Object.entries(payload)
    .map(([k, v]) => {
      const val = formatValue(v);
      if (!val) return "";
      const label = labels[k] ?? k;
      return `<tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #e5e7eb;white-space:nowrap;vertical-align:top;">${label}</td><td style="padding:8px 12px;color:#111827;border-bottom:1px solid #e5e7eb;">${val}</td></tr>`;
    })
    .filter(Boolean)
    .join("");

  const type = (payload.type as string) || "LEAD";

  return `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
  <div style="background:#1e3a5f;padding:20px 24px;">
    <h1 style="margin:0;color:#fff;font-size:18px;">Nouvelle lead ${type}</h1>
    <p style="margin:4px 0 0;color:#93c5fd;font-size:13px;">Transmeet — Plateforme logistique</p>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${rows}
  </table>
  <div style="padding:16px 24px;background:#f9fafb;font-size:12px;color:#6b7280;text-align:center;">
    Reçu via le formulaire ${type} sur trans-meet.com
  </div>
</div>
</body></html>`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;

    if (!RESEND_API_KEY) {
      console.warn("[Leads] RESEND_API_KEY absente — notification email ignorée (optionnel)");
    } else {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const type = (payload.type as string) || "CONTACT";
        const who =
          (payload.name as string) ??
          (payload.company as string) ??
          "Sans nom";

        const { data, error } = await resend.emails.send({
          from: RESEND_FROM,
          to: LEADS_EMAIL,
          subject: `[Transmeet] Nouvelle lead ${type} — ${who}`,
          text: formatLeadEmail(payload),
          html: buildHtmlEmail(payload),
        });

        if (error) {
          console.warn("[Resend] Email non envoyé (optionnel):", JSON.stringify(error));
        } else {
          console.info("[Resend] Email envoyé, id:", data?.id);
        }
      } catch (err) {
        console.warn("[Resend] Exception (email optionnel):", err);
      }
    }

    const savedToApi = await saveLeadToApi(payload);

    if (process.env.LEADS_WEBHOOK_URL) {
      fireWebhook(process.env.LEADS_WEBHOOK_URL, payload);
    }

    if (savedToApi) {
      return NextResponse.json({
        success: true,
        message: "Votre demande a bien été envoyée. Nous vous recontacterons rapidement.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "L'enregistrement de votre demande a échoué. Veuillez réessayer ou nous contacter directement.",
      },
      { status: 500 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

/** Enregistre la lead en base via l'API Fastify (bloquant). */
async function saveLeadToApi(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[Leads] Sauvegarde API échouée. Status:", res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[Leads] Exception lors de la sauvegarde API:", err);
    return false;
  }
}

/** Fire-and-forget : webhook vers Zapier/Make (non-bloquant). */
function fireWebhook(url: string, payload: Record<string, unknown>): void {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
