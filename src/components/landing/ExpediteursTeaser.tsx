import Link from "next/link";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ExpediteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Card className="overflow-hidden border-primary/20 bg-white shadow-lg">
        <div className="grid gap-8 p-6 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Pour les expéditeurs
            </p>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Trouvez rapidement des transporteurs fiables pour vos marchandises.
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Décrivez votre besoin, nous activons notre réseau de transporteurs
              vérifiés pour vous proposer la meilleure solution : type de camion,
              capacité, corridor, contraintes douanières.
            </p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Décrivez votre besoin</li>
              <li>2. Nous trouvons le transporteur adapté</li>
              <li>3. Livraison sécurisée et suivie</li>
            </ol>
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <a href={APP_ROUTES.register("expediteur")}>
                  Commander votre transport
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/expediteurs">Demander un devis</Link>
              </Button>
            </div>
          </div>
          <CardContent className="space-y-3 rounded-2xl bg-primary p-5 text-xs text-white/90">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-accent">
              Exemple de demande
            </p>
            <div className="rounded-xl border border-white/20 bg-white/5 p-4">
              <p className="text-[0.7rem] text-white/60">Expéditeur</p>
              <p className="mt-1 text-sm font-semibold">
                30T de ciment — Cotonou → Niamey
              </p>
              <p className="mt-1 text-white/80">
                Type camion : semi-remorque bâché · Départ sous 72h.
              </p>
            </div>
            <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
              <p className="text-[0.7rem] text-accent">Proposition</p>
              <p className="mt-1 text-sm font-semibold">
                Transporteur certifié, documents à jour, tracking activé.
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
