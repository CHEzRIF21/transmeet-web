import { Card, CardContent } from "@/components/ui/card";

const VALUES = [
  {
    title: "Ethique",
    description:
      "Une transparence totale avec les clients, ce qui permet d'instaurer un climat de confiance nécessaire à la bonne marche de nos relations.",
  },
  {
    title: "Excellence",
    description:
      "Un engagement à l'excellence dans l'exécution de nos services, en établissant des normes élevées pour la qualité, les performances et la satisfaction du client.",
  },
  {
    title: "Innovation",
    description:
      "Mettre la technologie au service de la satisfaction client.",
  },
];

export function ValuesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Nos valeurs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ce qui nous guide au quotidien
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <Card
              key={value.title}
              className="border-primary/10 bg-card transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
