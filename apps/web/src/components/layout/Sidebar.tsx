"use client";

import Link from "next/link";
import type { UserRole } from "@/lib/store/auth.store";

interface SidebarProps {
  role: UserRole | null;
}

const expediteurLinks = [
  { href: "/expediteur", label: "Dashboard" },
  { href: "/expediteur/demandes", label: "Demandes" },
  { href: "/expediteur/demandes/nouvelle", label: "Nouvelle demande" },
  { href: "/dashboard/missions", label: "Missions" },
  { href: "/dashboard/paiements", label: "Paiements" },
];

const transporteurLinks = [
  { href: "/transporteur", label: "Dashboard" },
  { href: "/transporteur/flotte", label: "Flotte" },
  { href: "/transporteur/offres", label: "Offres" },
  { href: "/dashboard/missions", label: "Missions" },
  { href: "/dashboard/paiements", label: "Paiements" },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
  { href: "/admin/kyc", label: "KYC" },
  { href: "/admin/parametres", label: "Paramètres" },
];

const sharedLinks = [
  { href: "/dashboard/messagerie", label: "Messagerie" },
  { href: "/shared/profil", label: "Profil" },
  { href: "/shared/notifications", label: "Notifications" },
];

export function Sidebar({ role }: SidebarProps) {
  const roleLinks =
    role === "EXPEDITEUR"
      ? expediteurLinks
      : role === "TRANSPORTEUR"
        ? transporteurLinks
        : role === "ADMIN"
          ? adminLinks
          : expediteurLinks;

  return (
    <aside className="w-56 border-r bg-muted/30 min-h-screen p-4 flex flex-col gap-4">
      <Link href="/" className="font-bold text-lg">
        Transmit
      </Link>
      <nav className="flex flex-col gap-1">
        {roleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <span className="border-t my-2" />
        {sharedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-2 rounded-md hover:bg-muted transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
