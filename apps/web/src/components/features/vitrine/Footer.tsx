import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from "@/lib/config";

const contact = {
  phone: CONTACT_PHONE,
  email: CONTACT_EMAIL,
  whatsapp: WHATSAPP_NUMBER,
};

const socialLinks = [
  { label: "Facebook", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-primary/80">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-transmeet.jpeg"
                alt="Transmeet"
                width={120}
                height={36}
                className="h-9 w-auto object-contain invert"
              />
            </Link>
            <p className="mt-2 text-sm text-white/70">
              La plateforme logistique qui connecte expéditeurs et transporteurs
              en Afrique de l&apos;Ouest.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Navigation</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li>
                <Link href="#qui-sommes-nous" className="hover:text-white">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link href="#expediteurs" className="hover:text-white">
                  Expéditeurs
                </Link>
              </li>
              <li>
                <Link href="#transporteurs" className="hover:text-white">
                  Transporteurs
                </Link>
              </li>
              <li>
                <Link href="#btp" className="hover:text-white">
                  BTP
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a
                  href={`https://wa.me/${contact.whatsapp.replace(/\s/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Réseaux sociaux</h3>
            <ul className="mt-2 space-y-2 text-sm text-white/70">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          &copy; {new Date().getFullYear()} Transmeet. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
