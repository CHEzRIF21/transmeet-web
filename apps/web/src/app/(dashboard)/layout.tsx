import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageTransition } from "@/components/layout/PageTransition";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar role={user.role} />
      <div className="md:pl-56">
        <DashboardHeader user={{ email: user.email, full_name: user.full_name }} role={user.role} />
        <main className="p-6">
        <PageTransition>{children}</PageTransition>
      </main>
      </div>
    </div>
  );
}
