const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function submitLead(payload: unknown): Promise<string> {
  const res = await fetch(`${API_BASE}/api/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Une erreur est survenue. Merci de réessayer.");
  }

  const data = (await res.json()) as {
    success: boolean;
    message?: string;
  };

  if (!data.success) {
    throw new Error(data.message ?? "Une erreur est survenue.");
  }

  return data.message ?? "Votre demande a bien été prise en compte.";
}
