import Link from "next/link";
import type { AppRole } from "@/types/database.types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: AppRole;
  className?: string;
}

const expediteurNav = [
  { href: "/dashboard/expediteur", label: "Tableau de bord" },
  { href: "/dashboard/expediteur/demandes", label: "Mes demandes" },
  { href: "/dashboard/expediteur/missions", label: "Missions" },
];

const transporteurNav = [
  { href: "/dashboard/transporteur", label: "Tableau de bord" },
  { href: "/dashboard/transporteur/vehicules", label: "Véhicules" },
  { href: "/dashboard/transporteur/missions", label: "Missions" },
];

const adminNav = [
  { href: "/dashboard/admin", label: "Tableau de bord" },
  { href: "/dashboard/admin/missions", label: "Missions" },
];

export function Sidebar({ role, className }: SidebarProps) {
  const nav =
    role === "admin"
      ? adminNav
      : role === "transporteur"
        ? transporteurNav
        : expediteurNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-56 border-r bg-card",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="font-semibold text-foreground">
          Transmeet
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
