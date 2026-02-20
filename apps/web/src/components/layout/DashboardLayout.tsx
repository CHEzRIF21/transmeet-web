"use client";

import { useAuthStore } from "@/lib/store/auth.store";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useAuthStore((s) => s.role);

  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
