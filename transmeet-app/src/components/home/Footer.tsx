import Link from "next/link";
import { Mail, Phone, MessageCircle } from "lucide-react";

const contact = {
  phone: "+229 00 00 00 00",
  email: "contact@transmeet.com",
  whatsapp: "+22900000000",
};

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-foreground">Transmeet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              La plateforme logistique qui connecte expéditeurs et transporteurs
              en Afrique de l&apos;Ouest.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">À propos</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#comment-ca-marche" className="hover:text-foreground">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#temoignages" className="hover:text-foreground">
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:text-foreground">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:text-foreground">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Réseaux sociaux</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-foreground">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Transmeet. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
