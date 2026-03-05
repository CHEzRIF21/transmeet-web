import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { TrackingContent } from "@/components/features/tracking/TrackingContent";

interface MissionTrackingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MissionTrackingPage({
  params,
}: MissionTrackingPageProps) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  return <TrackingContent missionId={id} />;
}
