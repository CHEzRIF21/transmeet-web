import Link from "next/link";
import Image from "next/image";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 sm:py-12 md:flex-row md:items-start md:justify-between">
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
            <p>Tél. : +229 XX XX XX XX</p>
            <p>Email : contact@transmeet.com</p>
          </div>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <a href={APP_ROUTES.login()}>Accéder à l&apos;application</a>
          </Button>
        </div>

        <div className="flex gap-12">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Navigation
            </div>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/qui-sommes-nous" className="hover:text-foreground">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="/expediteurs" className="hover:text-foreground">
                  Expéditeurs
                </Link>
              </li>
              <li>
                <Link href="/transporteurs" className="hover:text-foreground">
                  Transporteurs
                </Link>
              </li>
              <li>
                <Link href="/btp" className="hover:text-foreground">
                  BTP
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Légal
            </div>
            <ul className="space-y-1">
              <li>
                <Link href="/mentions-legales" className="hover:text-foreground">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-confidentialite"
                  className="hover:text-foreground"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Transmeet. Tous droits réservés.
      </div>
    </footer>
  );
}
