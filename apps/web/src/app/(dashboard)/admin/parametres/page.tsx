import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ParametresContent } from "@/components/features/admin/ParametresContent";

export default async function AdminParametresPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <ParametresContent />;
}
