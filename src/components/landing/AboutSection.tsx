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
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Transmeet est une plateforme logistique spécialisée dans le
            transport poids lourds et la mobilisation d&apos;engins de chantier.
            Grâce à l&apos;expertise cumulée de ses fondateurs et à un réseau
            construit sur plusieurs années, Transmeet propose des solutions
            complètes, fiables et adaptées aux besoins spécifiques de chaque
            client.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Notre mission est de garantir des opérations logistiques efficaces,
            sécurisées et conformes aux réglementations en vigueur, pour tous
            vos flux industriels, commerciaux et projets BTP.
          </p>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Valeurs
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Fiabilité &amp; sécurité</li>
                <li>• Réactivité &amp; transparence</li>
                <li>• Performance opérationnelle</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Secteurs
              </p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• Industrie &amp; agroalimentaire</li>
                <li>• Import / export &amp; transit</li>
                <li>• BTP, mines &amp; projets publics</li>
              </ul>
            </div>
          </div>
        </div>
        <Card className="border-primary/20 bg-muted/30">
          <CardContent className="p-6 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Réseau Afrique de l&apos;Ouest
            </p>
            <p className="mt-2 text-muted-foreground">
              Nous opérons sur les principaux corridors logistiques de l&apos;UEMOA
              et de la CEDEAO, avec un ancrage fort au Bénin et au Togo.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-primary/10 bg-background px-3 py-2 text-foreground shadow-sm">
                <p className="text-[0.7rem] text-muted-foreground">Hinterland</p>
                <p className="mt-1 font-semibold">
                  Niger · Burkina · Mali
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background px-3 py-2 text-foreground shadow-sm">
                <p className="text-[0.7rem] text-muted-foreground">Portuaire</p>
                <p className="mt-1 font-semibold">
                  Cotonou · Lomé · Abidjan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
