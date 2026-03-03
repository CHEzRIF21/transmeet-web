import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ExpediteurDashboardContent } from "@/components/features/dashboard/ExpediteurDashboardContent";

export default async function ExpediteurDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ExpediteurDashboardContent userId={user.id} />;
}
