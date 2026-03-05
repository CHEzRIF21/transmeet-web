import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OffresContent } from "@/components/features/transporteur/OffresContent";

export default async function TransporteurOffresPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "transporteur") redirect("/dashboard");

  return <OffresContent />;
}
