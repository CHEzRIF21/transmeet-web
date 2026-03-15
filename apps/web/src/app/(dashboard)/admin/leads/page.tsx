import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LeadsContent } from "@/components/features/admin/LeadsContent";

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <LeadsContent />;
}
