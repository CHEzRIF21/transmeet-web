import Link from "next/link";

export const metadata = {
  title: "Gestion des cookies — Transmeet",
  description:
    "Informations sur les cookies utilisés par Transmeet et comment gérer vos préférences.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
          Protection des données
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Gestion des cookies — Transmeet
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 14 mars 2025
        </p>
      </div>

      <div className="mt-8 space-y-10 text-base text-muted-foreground">
        <p>
          Cette page vous informe sur les cookies utilisés par le site Transmeet
          et sur la manière de gérer vos préférences.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. Cookies essentiels (nécessaires)
          </h2>
          <p>
            Ces cookies sont indispensables au fonctionnement du site. Ils ne
            peuvent pas être désactivés.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Nom / Type
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Finalité
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-2">
                    Session / Authentification
                  </td>
                  <td className="border border-border px-4 py-2">
                    Connexion sécurisée, gestion de session
                  </td>
                  <td className="border border-border px-4 py-2">
                    Session
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">
                    Préférences
                  </td>
                  <td className="border border-border px-4 py-2">
                    Paramètres utilisateur, langue
                  </td>
                  <td className="border border-border px-4 py-2">
                    12 mois
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Cookies analytiques (optionnels)
          </h2>
          <p>
            Ces cookies permettent de mesurer l&apos;audience du site et
            d&apos;améliorer son fonctionnement. Vous pouvez les refuser.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Nom / Type
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Finalité
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-2">
                    Analytics
                  </td>
                  <td className="border border-border px-4 py-2">
                    Mesure d&apos;audience, statistiques de navigation
                  </td>
                  <td className="border border-border px-4 py-2">
                    24 mois
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Comment gérer vos choix
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Paramètres de votre navigateur :</strong> vous pouvez
              configurer ou refuser les cookies dans les paramètres de Chrome,
              Safari, Firefox, Edge ou tout autre navigateur.
            </li>
            <li>
              <strong>Effet du refus :</strong> refuser certains cookies peut
              limiter certaines fonctionnalités du site (ex. connexion, mémorisation de préférences).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Plus d&apos;informations
          </h2>
          <p>
            Pour en savoir plus sur la collecte et l&apos;utilisation de vos
            données personnelles, consultez notre{" "}
            <Link href="/politique-confidentialite" className="text-accent hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
