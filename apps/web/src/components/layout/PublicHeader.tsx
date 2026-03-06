"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { springTransition, useReducedMotion } from "@/lib/motion";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/#qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/#expediteurs", label: "Expéditeurs" },
  { href: "/#transporteurs", label: "Transporteurs" },
  { href: "/#btp", label: "BTP" },
  { href: "/#contact", label: "Contact" },
];

const WHATSAPP_NUMBER = "+22900000000";

function usePathnameAndHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  useEffect(() => {
    setHash(typeof window !== "undefined" ? window.location.hash : "");
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return { pathname, hash };
}

function NavLink({
  href,
  label,
  isActive,
  className,
  onClick,
  variant = "desktop",
}: {
  href: string;
  label: string;
  isActive: boolean;
  className?: string;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const reduced = useReducedMotion();
  const isDesktop = variant === "desktop";

  return (
    <motion.div
      className={isDesktop ? "relative inline-flex" : "relative block w-full"}
      whileHover={reduced || !isDesktop ? undefined : { y: -1 }}
      transition={springTransition}
    >
      <Link
        href={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "relative py-1 transition-colors duration-200",
          isActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {label}
      </Link>
      {isActive && isDesktop && (
        <motion.span
          layoutId="header-nav-active"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
          transition={springTransition}
        />
      )}
    </motion.div>
  );
}

const HREF_TO_PAGE: Record<string, string> = {
  "/#qui-sommes-nous": "/qui-sommes-nous",
  "/#expediteurs": "/expediteurs",
  "/#transporteurs": "/transporteurs",
  "/#btp": "/btp",
  "/#contact": "/contact",
};

function getIsActive(href: string, pathname: string, hash: string): boolean {
  if (href === "/") return pathname === "/" && !hash;
  if (href.startsWith("/#")) {
    const matchOnHome = pathname === "/" && hash === href.slice(1);
    const matchOnPage = HREF_TO_PAGE[href] && pathname === HREF_TO_PAGE[href];
    return matchOnHome || !!matchOnPage;
  }
  return pathname.startsWith(href);
}

export function PublicHeader() {
  const { pathname, hash } = usePathnameAndHash();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
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
            <span className="hidden text-xs text-muted-foreground sm:block">
              Commandez votre camion
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Navigation principale"
          className="hidden items-center gap-6 text-sm font-medium md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={getIsActive(item.href, pathname, hash)}
            />
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contacter via WhatsApp"
            >
              WhatsApp
            </a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-background">
            <div className="flex h-16 items-center border-b px-5">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo TRANSMEET.jpeg"
                  alt="Transmeet"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                  Transmeet
                </span>
              </Link>
            </div>

            <nav aria-label="Menu mobile" className="flex flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => (
                <SheetClose asChild key={item.href}>
                  <NavLink
                    href={item.href}
                    label={item.label}
                    isActive={getIsActive(item.href, pathname, hash)}
                    variant="mobile"
                    className="block rounded-md px-3 py-2.5 text-base hover:bg-muted"
                  />
                </SheetClose>
              ))}
            </nav>

            <Separator />

            <div className="flex flex-col gap-2 p-4">
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="default" size="lg" className="w-full" asChild>
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </SheetClose>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <MessageCircle className="h-4 w-4" />
                Contacter via WhatsApp
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
