import Link from "next/link";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function TransporteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Card className="overflow-hidden border-primary/10 bg-muted/30 shadow-lg">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Pour les transporteurs
          </p>
          <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Boostez votre activité et augmentez vos revenus avec Transmeet.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Accédez à des missions régulières, des clients fiables et une
            visibilité régionale sur les corridors stratégiques. Nous sécurisons
            la relation commerciale pour vous concentrer sur l&apos;exploitation.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            <li>• Missions récurrentes adaptées à votre flotte</li>
            <li>• Visibilité régionale et nouveaux clients</li>
            <li>• Support logistique et administratif</li>
          </ul>
          <div className="mt-6">
            <Button variant="accent" size="lg" asChild>
              <Link href={APP_ROUTES.register("transporteur")}>
                Référencer mon camion
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
