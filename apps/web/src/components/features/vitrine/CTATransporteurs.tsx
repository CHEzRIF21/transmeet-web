import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTATransporteurs() {
  return (
    <section className="bg-accent py-16 text-accent-foreground md:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Rejoignez notre réseau de transporteurs
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Accédez à des missions régulières, gérez vos véhicules et suivez vos
          livraisons sur une seule plateforme.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-8 bg-white text-accent hover:bg-white/90"
          asChild
        >
          <Link href="/transporteurs">
            Rejoindre le réseau
          </Link>
        </Button>
      </div>
    </section>
  );
}
