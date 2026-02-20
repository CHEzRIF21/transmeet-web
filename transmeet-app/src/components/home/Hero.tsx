import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Transport logistique"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>
      <div className="container relative z-10 mx-auto flex min-h-[80vh] max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Transportez vos marchandises en toute confiance avec Transmeet
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
          La plateforme qui connecte expéditeurs et transporteurs professionnels
          en Afrique de l&apos;Ouest.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
            asChild
          >
            <Link href="/register?role=expediteur">Commander un transport</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/10 hover:text-white"
            asChild
          >
            <Link href="/register?role=transporteur">Devenir transporteur</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
