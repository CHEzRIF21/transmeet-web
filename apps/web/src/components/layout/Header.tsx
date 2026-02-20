"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-semibold">
          Transmit
        </Link>
        <span className="text-sm text-muted-foreground hidden sm:inline">
          Marketplace Logistique
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/shared/notifications"
          className="p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <span className="text-lg">🔔</span>
        </Link>
        <Link
          href="/shared/profil"
          className="text-sm font-medium hover:underline"
        >
          Profil
        </Link>
      </div>
    </header>
  );
}
