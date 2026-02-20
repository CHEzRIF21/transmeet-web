import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  switch (user.role) {
    case "admin":
      redirect("/dashboard/admin");
    case "transporteur":
      redirect("/dashboard/transporteur");
    case "expediteur":
    default:
      redirect("/dashboard/expediteur");
  }
}
