import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { MessagerieContent } from "@/components/features/messagerie/MessagerieContent";

export default async function MessageriePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <MessagerieContent />;
}
