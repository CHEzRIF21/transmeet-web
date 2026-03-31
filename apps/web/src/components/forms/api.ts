export async function submitLead(payload: unknown): Promise<string> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
  };

  if (!res.ok || data.success === false) {
    throw new Error(
      data.message ?? "Une erreur est survenue. Merci de réessayer."
    );
  }

  return data.message ?? "Votre demande a bien été prise en compte.";
}

