import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VueOperationnelle } from "./VueOperationnelle";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] bg-primary">
      <div className="container mx-auto flex min-h-[85vh] max-w-7xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8">
        {/* Hero content - left */}
        <div className="flex flex-1 flex-col justify-center lg:max-w-2xl">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-300">
              Logistique B2B — Afrique de l&apos;Ouest
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Transmeet — la puissance logistique au service de vos projets.
          </h1>

          <p className="mt-6 text-base text-white/90 sm:text-lg">
            Transport poids lourds, engins BTP et solutions logistiques sur mesure
            en Afrique de l&apos;Ouest. Un réseau sécurisé de transporteurs,
            transitaires et partenaires pour vos flux critiques.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90"
              asChild
            >
              <Link href="/register?role=expediteur">
                Commander un camion
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/register?role=transporteur">
                Référencer votre camion
              </Link>
            </Button>
          </div>
        </div>

        {/* Vue Opérationnelle card - right */}
        <div className="flex shrink-0 items-center justify-center lg:justify-end">
          <VueOperationnelle />
        </div>
      </div>
    </section>
  );
}
