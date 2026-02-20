"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Request {
  id: string;
  origin_city: string;
  dest_city: string;
}
interface Transporter {
  id: string;
  user_id: string;
}
interface Vehicle {
  id: string;
  plate_number: string;
  type: string;
  company_id: string;
}

interface CreateMissionFormProps {
  requests: Request[];
  transporters: Transporter[];
  vehicles: Vehicle[];
}

export function CreateMissionForm({ requests, vehicles }: CreateMissionFormProps) {
  const router = useRouter();
  const [request_id, setRequestId] = useState("");
  const [transporter_id, setTransporterId] = useState("");
  const [vehicle_id, setVehicleId] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!request_id || !transporter_id || !vehicle_id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id, transporter_id, vehicle_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setRequestId("");
      setTransporterId("");
      setVehicleId("");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-4">
      <div className="space-y-2">
        <Label>Demande</Label>
        <select
          className="flex h-9 w-full min-w-[200px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={request_id}
          onChange={(e) => setRequestId(e.target.value)}
        >
          <option value="">Choisir…</option>
          {requests.map((r) => (
            <option key={r.id} value={r.id}>{r.origin_city} → {r.dest_city}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Transporteur (ID)</Label>
        <Input
          className="w-48"
          placeholder="UUID transporteur"
          value={transporter_id}
          onChange={(e) => setTransporterId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Véhicule</Label>
        <select
          className="flex h-9 w-full min-w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={vehicle_id}
          onChange={(e) => setVehicleId(e.target.value)}
        >
          <option value="">Choisir…</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.plate_number} — {v.type}</option>
          ))}
        </select>
      </div>
      <Button type="submit" disabled={loading || !request_id || !transporter_id || !vehicle_id}>
        {loading ? "Création…" : "Créer la mission"}
      </Button>
    </form>
  );
}
