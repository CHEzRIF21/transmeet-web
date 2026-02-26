import Link from "next/link";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TransporteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Card className="overflow-hidden border-primary/10 bg-muted/30 shadow-lg">
        <div className="grid gap-8 p-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Pour les transporteurs
            </p>
            <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Boostez votre activité et augmentez vos revenus avec Transmeet.
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Accédez à des missions régulières, des clients fiables et une
              visibilité régionale sur les corridors stratégiques. Nous
              sécurisons la relation commerciale pour vous concentrer sur
              l&apos;exploitation.
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Missions récurrentes adaptées à votre flotte</li>
              <li>• Visibilité régionale et nouveaux clients</li>
              <li>• Support logistique et administratif</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild>
                <a href={APP_ROUTES.register("transporteur")}>
                  Rejoindre le réseau
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/transporteurs">Candidater</Link>
              </Button>
            </div>
          </div>
          <CardContent className="space-y-3 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-5 text-xs">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
              Profils recherchés
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/10 bg-muted/30 p-3">
                <p className="text-[0.7rem] text-muted-foreground">Propriétaires</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Camions plateau, bennes, citernes
                </p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-muted/30 p-3">
                <p className="text-[0.7rem] text-muted-foreground">Sociétés</p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  Flotte structurée, exploitation régionale
                </p>
              </div>
            </div>
            <p className="text-[0.7rem] text-muted-foreground">
              Nous valorisons les transporteurs sérieux, à jour de leurs
              documents et engagés sur la qualité de service.
            </p>
          </CardContent>
        </div>
      </Card>
    </section>
  );
}
