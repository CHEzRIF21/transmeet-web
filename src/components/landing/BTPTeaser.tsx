import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ENGIN_LIST = [
  { name: "Pelleteuse", detail: "Terrassement & excavation" },
  { name: "Bulldozer", detail: "Décapage & nivellement" },
  { name: "Nacelle", detail: "Travaux en hauteur" },
  { name: "Grue", detail: "Levage lourd" },
  { name: "Camion benne", detail: "Évacuation déblais" },
  { name: "Porte-char", detail: "Transport engins lourds" },
];

export function BTPTeaser() {
  return (
    <section className="relative overflow-hidden bg-primary py-14 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(224,168,66,0.12),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              BTP &amp; grands projets
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Location et transport d&apos;engins de chantier pour vos projets
              BTP.
            </h2>
            <p className="text-sm text-white/90 sm:text-base">
              Efficacité, rapidité et sécurité garanties sur vos chantiers
              routiers, industriels et immobiliers. Nous gérons la mobilisation
              des engins, le transport et la coordination logistique.
            </p>
            <Button
              variant="accent"
              size="lg"
              className="text-accent-foreground"
              asChild
            >
              <Link href="/btp">Demander un devis BTP</Link>
            </Button>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:aspect-[16/10]">
              <Image
                src="/images/engin BTP.jpeg"
                alt="Engins BTP - Transmeet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ENGIN_LIST.map((engin) => (
                <Card
                  key={engin.name}
                  className="border-white/20 bg-white/5 backdrop-blur"
                >
                  <CardContent className="p-3 text-xs">
                    <p className="text-[0.7rem] text-white/60">Engin</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {engin.name}
                    </p>
                    <p className="mt-1 text-white/80">{engin.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
