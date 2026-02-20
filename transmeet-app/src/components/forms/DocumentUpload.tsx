"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DOC_TYPES = [
  { value: "assurance", label: "Assurance" },
  { value: "licence", label: "Licence" },
  { value: "transport", label: "Document transport" },
] as const;

interface DocumentUploadProps {
  missionId?: string;
  vehicleId?: string;
  onUploaded?: () => void;
}

export function DocumentUpload({ missionId, vehicleId, onUploaded }: DocumentUploadProps) {
  const [type, setType] = useState<(typeof DOC_TYPES)[number]["value"]>("assurance");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || (!missionId && !vehicleId)) return;
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("type", type);
      if (missionId) form.set("mission_id", missionId);
      if (vehicleId) form.set("vehicle_id", vehicleId);
      const res = await fetch("/api/documents/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setFile(null);
      onUploaded?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <select
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          value={type}
          onChange={(e) => setType(e.target.value as (typeof DOC_TYPES)[number]["value"])}
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Fichier</Label>
        <Input
          type="file"
          className="mt-1"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={loading || !file}>
        {loading ? "Envoi…" : "Envoyer"}
      </Button>
    </form>
  );
}
