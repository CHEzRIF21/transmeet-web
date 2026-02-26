"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/config";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/expediteurs", label: "Expéditeurs" },
  { href: "/transporteurs", label: "Transporteurs" },
  { href: "/btp", label: "BTP" },
  { href: "/contact", label: "Contact" },
];

const WHATSAPP_NUMBER = "+22900000000";

export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo TRANSMEET.jpeg"
            alt="Transmeet"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Transmeet
            </span>
            <span className="text-xs text-muted-foreground">
              Logistique Afrique de l&apos;Ouest
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href={APP_ROUTES.login()}>Connexion</a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={APP_ROUTES.register()}>S&apos;inscrire</a>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
