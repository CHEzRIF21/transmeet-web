"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { MissionStatus } from "@/types/database.types";

const NEXT: Record<MissionStatus, MissionStatus | null> = {
  pending: "accepted",
  accepted: "in_transit",
  in_transit: "delivered",
  delivered: "completed",
  completed: null,
};

interface MissionStatusUpdateProps {
  missionId: string;
  currentStatus: MissionStatus;
}

export function MissionStatusUpdate({ missionId, currentStatus }: MissionStatusUpdateProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const next = NEXT[currentStatus];
  const label =
    next === "accepted"
      ? "Accepter"
      : next === "in_transit"
        ? "Démarrer le transport"
        : next === "delivered"
          ? "Marquer livrée"
          : next === "completed"
            ? "Terminer"
            : null;

  if (!next || !label) return null;

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${missionId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={() => void handleUpdate()} disabled={loading}>
      {loading ? "En cours…" : label}
    </Button>
  );
}
