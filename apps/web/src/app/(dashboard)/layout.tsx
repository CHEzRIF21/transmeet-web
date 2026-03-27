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
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-background">
      <DashboardSidebar role={user.role} />
      <div className="min-w-0 w-full max-w-[100vw] md:pl-56">
        <DashboardHeader user={{ email: user.email, full_name: user.full_name }} role={user.role} />
        <main className="min-w-0 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6 lg:px-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
