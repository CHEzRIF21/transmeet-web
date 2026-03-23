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
    <div className="min-h-screen overflow-x-hidden bg-background">
      <DashboardSidebar role={user.role} />
      <div className="min-w-0 md:pl-56">
        <DashboardHeader user={{ email: user.email, full_name: user.full_name }} role={user.role} />
        <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
