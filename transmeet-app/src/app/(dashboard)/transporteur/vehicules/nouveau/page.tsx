"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VehicleForm } from "@/components/forms/VehicleForm";
import type { VehicleInput } from "@/validations/vehicle";
import { Button } from "@/components/ui/button";

export default function NouveauVehiculePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: VehicleInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      router.push("/dashboard/transporteur/vehicules");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/transporteur/vehicules">← Retour</Link>
        </Button>
        <h1 className="text-2xl font-semibold">Nouveau véhicule</h1>
      </div>
      <div className="max-w-md">
        <VehicleForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
