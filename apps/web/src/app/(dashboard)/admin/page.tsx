import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminDashboardContent } from "@/components/features/dashboard/AdminDashboardContent";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <AdminDashboardContent />;
}
