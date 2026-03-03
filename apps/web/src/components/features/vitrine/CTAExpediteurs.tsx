import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTAExpediteurs() {
  return (
    <section className="bg-primary py-16 text-white md:py-24">
      <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Commander un transport maintenant
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Publiez votre demande et recevez des propositions de transporteurs
          qualifiés en quelques heures.
        </p>
        <Button
          size="lg"
          className="mt-8 bg-white text-primary hover:bg-white/90"
          asChild
        >
          <Link href="/register?role=expediteur">Créer une demande</Link>
        </Button>
      </div>
    </section>
  );
}
