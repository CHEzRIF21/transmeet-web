import { Card, CardContent } from "@/components/ui/card";

const SERVICES = [
  {
    title: "Formalités douanières",
    desc: "Préparation et suivi des dossiers, conformité réglementaire sur les principaux corridors.",
  },
  {
    title: "Transit marchandises",
    desc: "Gestion des flux import / export, coordination avec transitaires et entrepôts.",
  },
  {
    title: "Logistique portuaire",
    desc: "Coordination des sorties portuaires, rendez-vous camions, optimisation temps de séjour.",
  },
  {
    title: "Transport inter-pays",
    desc: "Opérations multi-pays au sein de l&apos;UEMOA / CEDEAO, gestion des frontières.",
  },
  {
    title: "Coordination commerciale",
    desc: "Interface sécurisée entre acheteurs, vendeurs et transporteurs pour les flux sensibles.",
  },
  {
    title: "Suivi & reporting",
    desc: "Traçabilité des missions, notifications et tableaux de bord pour vos équipes.",
  },
];

export function ServicesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Services complémentaires
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Bien plus qu&apos;un simple transport.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Transmeet se positionne comme un intermédiaire logistique
            intelligent, capable de piloter l&apos;ensemble de la chaîne :
            formalités, transit, coordination commerciale et opérations
            terrain.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Card
              key={service.title}
              className="border-primary/10 bg-card transition-shadow hover:shadow-md"
            >
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {service.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
