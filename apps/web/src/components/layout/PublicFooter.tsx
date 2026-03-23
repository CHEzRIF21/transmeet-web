import Link from "next/link";
import Image from "next/image";
import { APP_ROUTES, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-[#012767] to-[#021e4a]">
      {/* Wave transition avec bande or au-dessus */}
      <div
        className="absolute -top-12 left-0 right-0 z-30 h-12 w-full"
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,48 L0,24 Q720,0 1440,24 L1440,48 Z"
            fill="#012767"
          />
          <path
            d="M0,24 Q720,0 1440,24"
            stroke="#e0a842"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-sm text-white/70 sm:px-6 sm:py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo TRANSMEET.jpeg"
              alt="Transmeet"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="max-w-xs">
            Plateforme logistique premium pour l&apos;Afrique de l&apos;Ouest.
            Transport, BTP et solutions sur mesure.
          </p>
          <div className="space-y-1 text-xs">
            <p>Cotonou, Bénin</p>
            <p>
              Tél. :{" "}
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                {CONTACT_PHONE}
              </a>
            </p>
            <p>
              Email :{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
          <Button variant="accent" size="sm" className="mt-2" asChild>
            <Link href={APP_ROUTES.login()}>
              Accéder à l&apos;application
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
          <div className="space-y-2 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#e0a842]">
              Navigation
            </div>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/#qui-sommes-nous" className="text-white/70 hover:text-white transition-colors">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/#expediteurs" className="text-white/70 hover:text-white transition-colors">
                  Expéditeurs
                </Link>
              </li>
              <li>
                <Link href="/#transporteurs" className="text-white/70 hover:text-white transition-colors">
                  Transporteurs
                </Link>
              </li>
              <li>
                <Link href="/#btp" className="text-white/70 hover:text-white transition-colors">
                  BTP
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2 min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-[#e0a842]">
              Légal
            </div>
            <ul className="space-y-1">
              <li>
                <Link href="/mentions-legales" className="text-white/70 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="text-white/70 hover:text-white transition-colors">
                  CGU
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/70 hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Transmeet. Tous droits réservés.
      </div>
    </footer>
  );
}
