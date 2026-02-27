"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/lib/config";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/images/logo TRANSMEET.jpeg"
            alt="Transmeet"
            width={40}
            height={40}
            className="h-10 w-10 object-contain rounded-md"
            priority
          />
          <div className="hidden min-[400px]:flex flex-col leading-tight">
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
              Transmeet
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              Logistique Afrique de l&apos;Ouest
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors py-2 hover:text-primary ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Action Buttons - Desktop and large phones */}
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-sm font-semibold">
              <a href={APP_ROUTES.login()}>Connexion</a>
            </Button>
            <Button variant="outline" size="sm" asChild className="text-sm font-semibold border-primary text-primary hover:bg-primary/5">
              <a href={APP_ROUTES.register()}>S&apos;inscrire</a>
            </Button>
            <Button variant="accent" size="sm" asChild className="hidden min-[1100px]:flex shadow-sm">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 flex flex-col border-b border-border bg-background p-6 shadow-xl animate-in slide-in-from-top lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-medium py-2 ${
                  pathname === item.href ? "text-primary font-bold" : "text-foreground/80"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-border">
            <Button className="w-full justify-center text-base py-6" variant="outline" asChild onClick={() => setIsMobileMenuOpen(false)}>
              <a href={APP_ROUTES.login()}>Se connecter</a>
            </Button>
            <Button className="w-full justify-center text-base py-6" asChild onClick={() => setIsMobileMenuOpen(false)}>
              <a href={APP_ROUTES.register()}>Créer un compte</a>
            </Button>
            <Button className="w-full justify-center text-base py-6" variant="accent" asChild onClick={() => setIsMobileMenuOpen(false)}>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Nous contacter sur WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
