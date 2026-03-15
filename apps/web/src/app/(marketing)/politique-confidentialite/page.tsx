import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata = {
  title: "Politique de confidentialité — Transmeet",
  description:
    "Comment Transmeet collecte, utilise et protège vos données personnelles. Conformité RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
          Protection des données
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Politique de confidentialité — Transmeet
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 14 mars 2025
        </p>
      </div>

      <div className="mt-8 space-y-8 text-base text-muted-foreground">
        <p>
          Nous nous engageons à protéger vos données personnelles. Cette
          politique explique quelles données nous collectons, pourquoi et comment
          vous pouvez exercer vos droits.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. Responsable du traitement
          </h2>
          <p>
            <strong>Transmeet</strong>
            <br />
            Email :{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. Données que nous collectons
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Catégorie
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Exemples
                  </th>
                  <th className="border border-border px-4 py-2 text-left font-semibold text-foreground">
                    Finalité
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-4 py-2">Identité</td>
                  <td className="border border-border px-4 py-2">
                    Nom, prénom, email, téléphone
                  </td>
                  <td className="border border-border px-4 py-2">
                    Compte utilisateur, contact
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">
                    Professionnel
                  </td>
                  <td className="border border-border px-4 py-2">
                    Informations sur votre entreprise ou activité
                  </td>
                  <td className="border border-border px-4 py-2">
                    Mise en relation expéditeur/transporteur
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Activité</td>
                  <td className="border border-border px-4 py-2">
                    Demandes de transport, offres, missions
                  </td>
                  <td className="border border-border px-4 py-2">
                    Fonctionnement de la plateforme
                  </td>
                </tr>
                <tr>
                  <td className="border border-border px-4 py-2">Technique</td>
                  <td className="border border-border px-4 py-2">
                    Adresse IP, type de navigateur
                  </td>
                  <td className="border border-border px-4 py-2">
                    Sécurité, personnalisation
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. Bases légales et finalités
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Exécution du contrat :</strong> gestion du compte, mise en
              relation, suivi des missions
            </li>
            <li>
              <strong>Intérêt légitime :</strong> amélioration des services,
              sécurité, lutte contre la fraude
            </li>
            <li>
              <strong>Consentement :</strong> newsletter, cookies non essentiels
              (lorsque applicable)
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. Durée de conservation
          </h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Compte actif :</strong> pendant toute la durée du compte
              et jusqu&apos;à 3 ans après la dernière activité
            </li>
            <li>
              <strong>Données de facturation :</strong> obligations légales
              (ex. 10 ans selon le pays)
            </li>
            <li>
              <strong>Cookies :</strong> selon la durée indiquée dans notre{" "}
              <Link href="/cookies" className="text-accent hover:underline">
                politique cookies
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. Vos droits (RGPD)
          </h2>
          <p>Vous disposez notamment des droits suivants :</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Accès :</strong> demander une copie de vos données
            </li>
            <li>
              <strong>Rectification :</strong> corriger des données inexactes
            </li>
            <li>
              <strong>Effacement :</strong> demander la suppression de vos
              données
            </li>
            <li>
              <strong>Opposition :</strong> vous opposer à certains traitements
            </li>
            <li>
              <strong>Portabilité :</strong> recevoir vos données dans un format
              structuré
            </li>
            <li>
              <strong>Réclamation :</strong> saisir l&apos;autorité compétente
              (CNIL pour la France, autorités locales pour le Bénin/Togo/Niger)
            </li>
          </ul>
          <p>
            <strong>Pour exercer vos droits :</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
            <br />
            Délai de réponse : 1 mois maximum
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">6. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l&apos;expérience
            utilisateur, mesurer l&apos;audience et sécuriser les connexions.
            Vous pouvez gérer vos préférences dans les paramètres de votre
            navigateur ou via notre{" "}
            <Link href="/cookies" className="text-accent hover:underline">
              page dédiée
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            7. Modifications
          </h2>
          <p>
            Nous pouvons mettre à jour cette politique. La date de dernière mise
            à jour sera modifiée en conséquence. Nous vous encourageons à la
            consulter régulièrement.
          </p>
        </section>
      </div>
    </div>
  );
}
