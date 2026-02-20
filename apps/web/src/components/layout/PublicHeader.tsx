"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            T
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-accent-foreground shadow-sm transition hover:bg-accent/90 sm:inline-flex"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}

