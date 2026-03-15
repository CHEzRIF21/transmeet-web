import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata = {
  title: "Mentions légales — Transmeet",
  description:
    "Mentions légales et informations sur l'éditeur du site Transmeet, plateforme de mise en relation logistique en Afrique de l'Ouest.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
          Légal
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Mentions légales — Transmeet
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 14 mars 2025
        </p>
      </div>

      <div className="mt-8 space-y-10 text-base text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. Éditeur du site
          </h2>
          <p>
            <strong>Transmeet</strong> est une plateforme numérique de mise en
            relation entre expéditeurs de marchandises et transporteurs
            professionnels en Afrique de l&apos;Ouest.
          </p>
          <ul className="list-none space-y-1">
            <li>
              <strong>Raison sociale :</strong> Transmeet
            </li>
            <li>
              <strong>Adresse :</strong> Cotonou, Bénin
            </li>
            <li>
              <strong>Email :</strong>{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <strong>Directeur de la publication :</strong> [Nom du
              responsable]
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Hébergement
          </h2>
          <p>Le site est hébergé par :</p>
          <p className="font-medium">
            Hostinger International Ltd
            <br />
            61 Lordou Vironos Street — 6023 Larnaca — Chypre
            <br />
            <a
              href="https://www.hostinger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              https://www.hostinger.com
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Propriété intellectuelle
          </h2>
          <p>
            L&apos;ensemble des contenus du site (textes, images, logos,
            graphismes) est protégé par les lois relatives à la propriété
            intellectuelle. Toute reproduction, modification ou diffusion sans
            autorisation préalable est interdite.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Responsabilité et rôle de la plateforme
          </h2>
          <p>
            Transmeet agit exclusivement comme{" "}
            <strong>intermédiaire de mise en relation</strong> entre expéditeurs
            et transporteurs. La société ne réalise pas de prestations de
            transport et n&apos;intervient pas en tant que transporteur. Les
            prestations sont réalisées sous la responsabilité exclusive des
            transporteurs partenaires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Liens utiles
          </h2>
          <ul className="space-y-1">
            <li>
              <Link href="/politique-confidentialite" className="text-accent hover:underline">
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link href="/cgu" className="text-accent hover:underline">
                Conditions générales d&apos;utilisation (CGU)
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
