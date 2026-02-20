"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShipmentRequestForm } from "@/components/forms/ShipmentRequestForm";
import type { ShipmentRequestInput } from "@/validations/shipment-request";
import { Button } from "@/components/ui/button";

export default function NouvelleDemandePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ShipmentRequestInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/shipment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      router.push("/dashboard/expediteur/demandes");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/expediteur/demandes">← Retour</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Nouvelle demande de transport</h1>
      </div>
      <div className="max-w-md">
        <ShipmentRequestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
