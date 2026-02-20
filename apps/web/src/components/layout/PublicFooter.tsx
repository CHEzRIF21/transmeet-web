export function PublicFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 sm:py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="text-base font-semibold text-foreground">
            Transmeet
          </div>
          <p className="max-w-xs">
            Plateforme logistique premium pour l&apos;Afrique de l&apos;Ouest.
            Transport, BTP et solutions sur mesure.
          </p>
          <div className="space-y-1 text-xs">
            <p>Cotonou, Bénin</p>
            <p>Tél. : +229 XX XX XX XX</p>
            <p>Email : contact@transmeet.com</p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-foreground">
              Légal
            </div>
            <ul className="space-y-1">
              <li>
                <a href="/mentions-legales" className="hover:text-foreground">
                  Mentions légales
                </a>
              </li>
              <li>
                <a
                  href="/politique-confidentialite"
                  className="hover:text-foreground"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="/cookies" className="hover:text-foreground">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Transmeet. Tous droits réservés.
      </div>
    </footer>
  );
}

