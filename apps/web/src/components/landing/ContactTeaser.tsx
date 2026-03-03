import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ContactTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
      <Card className="overflow-hidden border-primary/20 bg-primary shadow-lg">
        <CardContent className="flex flex-col gap-4 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              Contact &amp; accompagnement
            </p>
            <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
              Un projet, une urgence ou un besoin récurrent ?
            </h2>
            <p className="max-w-xl text-sm text-white/90 sm:text-base">
              Parlez-nous de vos flux et de vos contraintes, nous vous
              proposerons une approche sur-mesure pour vos opérations
              logistiques.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              variant="accent"
              size="lg"
              className="text-accent-foreground"
              asChild
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
            <p className="text-xs text-white/70">
              Ou en direct via WhatsApp et téléphone.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
