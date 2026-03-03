import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TransporteurDashboardContent } from "@/components/features/dashboard/TransporteurDashboardContent";

export default async function TransporteurDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <TransporteurDashboardContent userId={user.id} />;
}
