import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MissionsContent } from "@/components/features/missions/MissionsContent";

export default async function DashboardMissionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.role !== "expediteur" && user.role !== "transporteur") {
    redirect("/dashboard");
  }

  return <MissionsContent role={user.role} />;
}
