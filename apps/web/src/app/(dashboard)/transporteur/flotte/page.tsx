import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { FlotteContent } from "@/components/features/transporteur/FlotteContent";

export default async function TransporteurFlottePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "transporteur") redirect("/dashboard");

  return <FlotteContent />;
}
