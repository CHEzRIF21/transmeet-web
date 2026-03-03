import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const roleRoutes: Record<string, string> = {
    admin: "/admin",
    transporteur: "/transporteur",
    expediteur: "/expediteur",
  };

  const target = roleRoutes[user.role] ?? "/expediteur";
  redirect(target);
}
