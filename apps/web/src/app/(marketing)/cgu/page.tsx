import Link from "next/link";

export const metadata = {
  title: "Conditions générales d'utilisation (CGU) — Transmeet",
  description:
    "Conditions générales d'utilisation de la plateforme Transmeet, mise en relation expéditeurs et transporteurs.",
};

export default function CguPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
          Légal
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Conditions générales d&apos;utilisation (CGU) — Transmeet
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 14 mars 2025
        </p>
      </div>

      <div className="mt-8 space-y-10 text-base text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation ont pour objet
            de définir les modalités d&apos;utilisation de la plateforme
            Transmeet. L&apos;accès et l&apos;utilisation du site impliquent
            l&apos;acceptation pleine et entière des présentes conditions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Accès à la plateforme
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>L&apos;accès au site est libre et gratuit.</li>
            <li>
              Certaines fonctionnalités peuvent nécessiter la création d&apos;un
              compte utilisateur ou la transmission d&apos;informations
              personnelles ou professionnelles.
            </li>
            <li>
              Les utilisateurs s&apos;engagent à fournir des informations
              exactes et à les mettre à jour si nécessaire.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Fonctionnement de la plateforme
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              La plateforme permet aux expéditeurs de publier des demandes de
              transport, aux transporteurs de proposer leurs services et de
              faciliter la mise en relation entre les deux parties.
            </li>
            <li>
              Transmeet agit exclusivement comme intermédiaire technique de mise
              en relation.
            </li>
            <li>
              Le contrat de transport est conclu directement entre
              l&apos;expéditeur et le transporteur.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Obligations des transporteurs
          </h2>
          <p>
            Les transporteurs utilisant la plateforme doivent disposer des
            autorisations nécessaires à l&apos;exercice de leur activité,
            respecter la réglementation applicable au transport de marchandises
            et disposer d&apos;une assurance professionnelle valide.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Responsabilité
          </h2>
          <p>
            Transmeet ne peut être tenu responsable des prestations de transport
            réalisées par les transporteurs, des retards de livraison, des
            dommages ou pertes de marchandises ou des litiges entre expéditeurs
            et transporteurs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            6. Suspension de compte
          </h2>
          <p>
            Transmeet se réserve le droit de suspendre ou supprimer un compte
            utilisateur en cas de violation des présentes CGU, d&apos;activité
            frauduleuse ou de non-respect de la réglementation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Droit applicable
          </h2>
          <p>
            Les présentes conditions sont régies par le droit applicable dans le
            pays d&apos;établissement de la société éditrice du site. En cas de
            litige, les parties s&apos;efforceront de trouver une solution amiable
            avant toute procédure judiciaire.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            8. Liens utiles
          </h2>
          <ul className="space-y-1">
            <li>
              <Link href="/mentions-legales" className="text-accent hover:underline">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite" className="text-accent hover:underline">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-accent hover:underline">
                Gestion des cookies
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
