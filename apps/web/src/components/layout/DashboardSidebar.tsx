"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ClipboardList,
  CreditCard,
  Users,
  MessageSquare,
  User,
  Bell,
  ShieldCheck,
  Settings,
  FileText,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/database.types";

interface DashboardSidebarProps {
  role: AppRole;
  className?: string;
  variant?: "fixed" | "drawer";
  onNavigate?: () => void;
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const expediteurNav: NavItem[] = [
  { href: "/expediteur", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/expediteur/demandes", label: "Mes demandes", icon: ClipboardList },
  { href: "/expediteur/missions", label: "Missions", icon: Truck },
  { href: "/expediteur/paiements", label: "Paiements", icon: CreditCard },
];

const transporteurNav: NavItem[] = [
  { href: "/transporteur", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/transporteur/flotte", label: "Ma flotte", icon: Layers },
  { href: "/transporteur/vehicules", label: "Véhicules", icon: Truck },
  { href: "/transporteur/offres", label: "Offres", icon: FileText },
  { href: "/transporteur/missions", label: "Missions", icon: ClipboardList },
  { href: "/transporteur/paiements", label: "Paiements", icon: CreditCard },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/missions", label: "Missions", icon: ClipboardList },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/admin/kyc", label: "KYC", icon: ShieldCheck },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

const sharedNav: NavItem[] = [
  { href: "/shared/messagerie", label: "Messagerie", icon: MessageSquare },
  { href: "/shared/notifications", label: "Notifications", icon: Bell },
  { href: "/shared/profil", label: "Mon profil", icon: User },
];

export function DashboardSidebar({ role, className, variant = "fixed", onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  const mainNav =
    role === "admin"
      ? adminNav
      : role === "transporteur"
        ? transporteurNav
        : expediteurNav;

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
  }

  const isDrawer = variant === "drawer";
  const handleNavClick = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-white/10 bg-primary",
        !isDrawer && "fixed left-0 top-0 z-40 hidden h-screen w-56 md:flex",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={isDrawer ? handleNavClick : undefined}
        >
          <Image
            src="/images/logo TRANSMEET.jpeg"
            alt="Transmeet"
            width={32}
            height={32}
            className="h-8 w-8 rounded object-contain"
          />
          <span className="text-sm font-bold uppercase tracking-wider text-white">
            Transmeet
          </span>
        </Link>
      </div>

      {/* Main nav */}
      <nav
        aria-label="Navigation dashboard"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        <p className="mb-1 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-white/40">
          Principal
        </p>
        {mainNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={isDrawer ? handleNavClick : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-accent" : "text-white/50 group-hover:text-white/80"
                )}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-white/10" />

        <p className="mb-1 px-3 text-[0.65rem] font-semibold uppercase tracking-widest text-white/40">
          Mon espace
        </p>
        {sharedNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={isDrawer ? handleNavClick : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active ? "text-accent" : "text-white/50 group-hover:text-white/80"
                )}
              />
              {item.label}
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer badge */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
          <span className="text-xs text-white/60">Plateforme active</span>
        </div>
      </div>
    </aside>
  );
}
