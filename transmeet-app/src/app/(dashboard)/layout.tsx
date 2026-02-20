import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={user.role} />
      <div className="pl-56">
        <DashboardHeader user={{ email: user.email, full_name: user.full_name }} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
