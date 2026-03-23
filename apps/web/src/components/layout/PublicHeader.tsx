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
import { cn } from "@/lib/utils";
import { springTransition, useReducedMotion } from "@/lib/motion";
import { WHATSAPP_NUMBER } from "@/lib/config";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/#qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#expediteurs", label: "Expéditeurs" },
  { href: "/#transporteurs", label: "Transporteurs" },
  { href: "/#btp", label: "BTP" },
  { href: "/#contact", label: "Contact" },
];

const SECTION_IDS = [
  "qui-sommes-nous",
  "comment-ca-marche",
  "expediteurs",
  "transporteurs",
  "btp",
  "contact",
] as const;

function useScrollSpy(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState("");
  const pathname = usePathname();
  const sectionIdsKey = sectionIds.join(",");

  useEffect(() => {
    if (typeof window === "undefined" || pathname !== "/") return;

    const visibleSections = new Map<string, boolean>();
    sectionIds.forEach((id) => visibleSections.set(id, false));

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        visibleSections.set(entry.target.id, entry.isIntersecting);
      });

      for (const id of sectionIds) {
        if (visibleSections.get(id)) {
          setActiveId(id);
          return;
        }
      }
      if (window.scrollY < 100) {
        setActiveId("");
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname, sectionIdsKey, sectionIds]);

  return activeId;
}

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
            ? "text-[#e0a842] font-semibold"
            : "text-white/70 hover:text-white",
          className
        )}
      >
        {label}
      </Link>
      {isActive && isDesktop && (
        <motion.span
          layoutId="header-nav-active"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[#e0a842]"
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

function getIsActive(
  href: string,
  pathname: string,
  hash: string,
  activeScrollId: string
): boolean {
  if (href === "/")
    return pathname === "/" && !activeScrollId && !hash;
  if (href.startsWith("/#")) {
    const sectionId = href.slice(2); // href is "/#qui-sommes-nous", sectionId = "qui-sommes-nous"
    const matchOnHome =
      pathname === "/" &&
      (activeScrollId === sectionId ||
        (hash === "#" + sectionId && !activeScrollId));
    const matchOnPage = HREF_TO_PAGE[href] && pathname === HREF_TO_PAGE[href];
    return matchOnHome || !!matchOnPage;
  }
  return pathname.startsWith(href);
}

export function PublicHeader() {
  const { pathname, hash } = usePathnameAndHash();
  const activeScrollId = useScrollSpy(SECTION_IDS);
  return (
    <header className="sticky top-0 z-40 overflow-visible bg-[#012767] shadow-lg shadow-[#012767]/20">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo TRANSMEET.jpeg"
            alt="Transmeet"
            width={52}
            height={52}
            className="h-12 w-12 object-contain sm:h-[52px] sm:w-[52px]"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold uppercase tracking-[0.22em] text-white">
              Transmeet
            </span>
            <span className="hidden text-xs text-white/60 sm:block">
              Commandez votre camion !
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
              isActive={getIsActive(item.href, pathname, hash, activeScrollId)}
            />
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="/register">S&apos;inscrire</Link>
          </Button>
          <Button variant="accent" size="sm" asChild>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
              className="md:hidden text-white hover:bg-white/10"
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-[#012767]">
            <div className="flex h-16 items-center border-b border-white/10 px-5">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo TRANSMEET.jpeg"
                  alt="Transmeet"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
                <span className="text-base font-bold uppercase tracking-[0.22em] text-white">
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
                    isActive={getIsActive(item.href, pathname, hash, activeScrollId)}
                    variant="mobile"
                    className="block rounded-md px-3 py-2.5 text-base text-white/70 hover:bg-white/10 hover:text-white"
                  />
                </SheetClose>
              ))}
            </nav>

            <div className="mx-4 border-t border-white/10" />

            <div className="flex flex-col gap-2 p-4">
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full border-white/30 text-white hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/login">Connexion</Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="accent" size="lg" className="w-full" asChild>
                  <Link href="/register">S&apos;inscrire</Link>
                </Button>
              </SheetClose>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
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

      {/* Wave transition avec bande or */}
      <div
        className="absolute -bottom-12 left-0 right-0 z-30 h-12 w-full"
        aria-hidden
      >
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0,0 L0,24 Q720,48 1440,24 L1440,0 Z"
            fill="#012767"
          />
          <path
            d="M0,24 Q720,48 1440,24"
            stroke="#e0a842"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
    </header>
  );
}
