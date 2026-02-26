import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    quote:
      "Transmeet nous a permis de fiabiliser nos flux vers le Niger avec des transporteurs sélectionnés et un suivi opérationnel.",
    name: "Responsable logistique",
    company: "Groupe agroalimentaire",
  },
  {
    quote:
      "En tant que transporteur, nous apprécions la clarté des missions et la qualité de la relation avec les expéditeurs.",
    name: "Dirigeant flotte poids lourds",
    company: "Société de transport",
  },
  {
    quote:
      "Pour nos chantiers BTP, la mobilisation des engins et des camions est devenue beaucoup plus fluide.",
    name: "Directeur de projet",
    company: "Entreprise de construction",
  },
];

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Témoignages
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ils nous font confiance.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Entreprises industrielles, importateurs, acteurs BTP et
            transporteurs s&apos;appuient sur Transmeet pour sécuriser leurs
            opérations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="border-primary/10 bg-card transition-shadow hover:shadow-md"
            >
              <CardContent className="flex flex-col justify-between p-4">
                <blockquote className="text-xs text-muted-foreground sm:text-sm">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-xs">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground">{t.company}</div>
                </figcaption>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
