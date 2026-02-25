"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SeedTestUsersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    results?: string[];
    credentials?: Record<string, { email: string; password: string }>;
    error?: string;
  } | null>(null);

  async function handleSeed() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/seed-test-users", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Erreur inconnue",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Comptes de test Transmeet</CardTitle>
          <CardDescription>
            Crée ou réinitialise les mots de passe des comptes expéditeur et transporteur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Création en cours..." : "Créer / Réinitialiser les comptes"}
          </Button>

          {result && (
            <div className="space-y-4 rounded-lg border p-4">
              {result.results?.map((r, i) => (
                <p key={i} className="text-sm">
                  {r}
                </p>
              ))}
              {result.credentials && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="font-semibold">Identifiants de connexion :</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Expéditeur :</strong> {result.credentials.expediteur.email} /{" "}
                      {result.credentials.expediteur.password}
                    </p>
                    <p>
                      <strong>Transporteur :</strong> {result.credentials.transporteur.email} /{" "}
                      {result.credentials.transporteur.password}
                    </p>
                  </div>
                  <Button asChild size="sm" className="mt-2">
                    <a href="/login">Aller à la connexion</a>
                  </Button>
                </div>
              )}
              {result.error && (
                <p className="text-destructive">{result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
