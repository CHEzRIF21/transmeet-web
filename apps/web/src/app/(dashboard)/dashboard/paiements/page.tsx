import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PaiementsContent } from "@/components/features/paiements/PaiementsContent";

export default async function DashboardPaiementsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "expediteur" && user.role !== "transporteur") {
    redirect("/dashboard");
  }

  return <PaiementsContent role={user.role} />;
}
