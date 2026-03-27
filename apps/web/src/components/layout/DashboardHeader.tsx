"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type { AppRole } from "@/types/database.types";

interface DashboardHeaderProps {
  user: {
    email: string | null;
    full_name: string | null;
  };
  role: AppRole;
}

function getInitials(name: string | null, email: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function DashboardHeader({ user, role }: DashboardHeaderProps) {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = user.full_name ?? user.email ?? "Compte";
  const initials = getInitials(user.full_name, user.email);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 min-w-0 items-center justify-between border-b bg-background/95 px-3 sm:px-4 md:px-6 backdrop-blur">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-2">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
          <SheetContent
            side="left"
            className="flex h-full w-[85vw] max-w-64 flex-col p-0 [&>button]:text-white [&>button]:hover:bg-white/10"
          >
            <DashboardSidebar
              role={role}
              variant="drawer"
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          Tableau de bord
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Notifications bell */}
        <NotificationBell />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex max-w-[170px] items-center gap-2 px-1.5 hover:bg-muted sm:px-2"
              aria-label="Menu utilisateur"
            >
              <Avatar className="h-8 w-8 border-2 border-accent/30">
                <AvatarFallback className="bg-primary text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start sm:flex">
                <span className="max-w-[110px] truncate text-xs font-semibold text-foreground lg:max-w-[150px]">
                  {displayName}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-foreground">{user.full_name ?? "Utilisateur"}</p>
              <p className="truncate text-[0.7rem] text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/shared/profil" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/parametres" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="flex items-center gap-2"
              onSelect={() => void handleSignOut()}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
