"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VehicleForm } from "@/components/forms/VehicleForm";
import type { VehicleInput } from "@/validations/vehicle";
import type { Vehicle } from "@/types/database.types";
import { Button } from "@/components/ui/button";

interface VehicleEditFormProps {
  vehicle: Vehicle;
}

export function VehicleEditForm({ vehicle }: VehicleEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: VehicleInput) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
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
    <>
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/dashboard/transporteur/vehicules">← Retour</Link>
      </Button>
      <VehicleForm defaultValues={vehicle} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </>
  );
}
