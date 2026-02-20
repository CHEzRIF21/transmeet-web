"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface VehicleActionsProps {
  vehicleId: string;
}

export function VehicleActions({ vehicleId }: VehicleActionsProps) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Supprimer ce véhicule ?")) return;
    const res = await fetch(`/api/vehicles/${vehicleId}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const j = await res.json();
      alert(j.error ?? "Erreur");
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => void handleDelete()} className="text-destructive">
      Supprimer
    </Button>
  );
}
