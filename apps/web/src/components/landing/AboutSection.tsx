import { Card, CardContent } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Qui sommes-nous ?
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Une plateforme logistique dédiée aux projets ambitieux.
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Transmeet est une plateforme digitale de logistique lourde dédiée au
            transport de marchandises et à la mise à disposition d&apos;engins
            BTP. Nous combinons expertise terrain et innovation technologique
            pour offrir des solutions logistiques fiables, structurées et
            adaptées aux exigences des professionnels.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Grâce à notre solution de suivi en temps réel (tracking), nos clients
            bénéficient d&apos;une visibilité complète sur leurs opérations,
            renforçant ainsi la sécurité, la maîtrise des délais et la
            transparence.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Notre mission est de fournir des solutions logistiques
            personnalisées alliant efficacité opérationnelle, sécurité,
            transparence et conformité réglementaire.
          </p>
        </div>
        <Card className="border-primary/20 bg-muted/30">
          <CardContent className="p-6 text-base">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Réseau Afrique de l&apos;Ouest
            </p>
            <p className="mt-2 text-muted-foreground">
              Nous opérons sur les principaux corridors logistiques de
              l&apos;UEMOA et de la CEDEAO, avec un ancrage fort au Bénin et au
              Togo.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-primary/10 bg-background px-3 py-2 text-foreground shadow-sm">
                <p className="text-[0.7rem] text-muted-foreground">Hinterland</p>
                <p className="mt-1 font-semibold">Niger · Burkina · Mali</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background px-3 py-2 text-foreground shadow-sm">
                <p className="text-[0.7rem] text-muted-foreground">Portuaire</p>
                <p className="mt-1 font-semibold">Cotonou · Lomé</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
