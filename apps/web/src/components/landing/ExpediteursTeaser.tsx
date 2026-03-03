import Link from "next/link";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ExpediteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <Card className="overflow-hidden border-primary/20 bg-white shadow-lg">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Pour les expéditeurs
          </p>
          <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Expéditeurs, profitez d&apos;une communauté de transporteurs fiables
            et rigoureux pour vos besoins en transport.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Inscrivez-vous et votre équipe vous recontactera dans les meilleurs
            délais.
          </p>
          <div className="mt-6">
            <Button variant="accent" size="lg" asChild>
              <Link href={APP_ROUTES.register("expediteur")}>
                Commander votre camion
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
