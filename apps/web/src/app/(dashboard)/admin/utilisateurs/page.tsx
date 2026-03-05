import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UtilisateursContent } from "@/components/features/admin/UtilisateursContent";

export default async function AdminUtilisateursPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <UtilisateursContent />;
}
