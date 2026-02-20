"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AcceptMissionButtonProps {
  missionId: string;
}

export function AcceptMissionButton({ missionId }: AcceptMissionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAccept() {
    setLoading(true);
    try {
      const res = await fetch(`/api/missions/${missionId}/accept`, { method: "PATCH" });
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
    <Button onClick={() => void handleAccept()} disabled={loading}>
      {loading ? "En cours…" : "Accepter la mission"}
    </Button>
  );
}
