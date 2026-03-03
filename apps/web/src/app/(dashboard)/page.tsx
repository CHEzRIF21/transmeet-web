'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // La redirection précise par rôle est gérée côté serveur (middleware / layout).
    // Ici on envoie simplement l'utilisateur vers la racine du dashboard.
    router.replace("/dashboard/expediteur");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Chargement de votre espace Transmeet...</p>
    </div>
  );
}
