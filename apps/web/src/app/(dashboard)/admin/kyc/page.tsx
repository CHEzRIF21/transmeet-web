import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { KycContent } from "@/components/features/admin/KycContent";

export default async function AdminKycPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return <KycContent />;
}
