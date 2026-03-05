"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  MapPin,
  User,
  Calendar,
  Star,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import {
  useMission,
  useMissionStatusUpdate,
  useMissionReview,
} from "@/lib/api/missions";
import { formatXOF } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

const STATUS_LABELS: Record<string, string> = {
  ASSIGNED: "Confirmée",
  LOADING: "Chargement",
  IN_TRANSIT: "En transit",
  AT_CUSTOMS: "En douane",
  DELIVERED: "Livrée",
  DISPUTED: "Litige",
};

const NEXT_STATUS: Record<string, string> = {
  ASSIGNED: "LOADING",
  LOADING: "IN_TRANSIT",
  IN_TRANSIT: "AT_CUSTOMS",
  AT_CUSTOMS: "DELIVERED",
};

export default function MissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { accessToken, profile } = useProfile();
  const { data: mission, isLoading } = useMission(id, accessToken);
  const updateStatus = useMissionStatusUpdate(accessToken);
  const submitReview = useMissionReview(accessToken);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (isLoading || !mission) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const m = mission as {
    id: string;
    reference?: string | null;
    status: string;
    agreedPrice: number | { toNumber?: () => number };
    request?: {
      originCity: string;
      destCity: string;
      originCountry?: string;
      destCountry?: string;
      goodsType: string;
    };
    carrier?: { full_name?: string | null; phone?: string | null };
    vehicle?: { plateNumber?: string } | null;
  };

  const price = typeof m.agreedPrice === "object" && m.agreedPrice?.toNumber
    ? m.agreedPrice.toNumber()
    : Number(m.agreedPrice);

  const isTransporteur =
    profile?.role?.toLowerCase() === "transporteur";
  const isExpediteur = profile?.role?.toLowerCase() === "expediteur";
  const canUpdateStatus = isTransporteur && NEXT_STATUS[m.status];
  const canReview = isExpediteur && m.status === "DELIVERED";

  async function handleStatusUpdate(newStatus: string) {
    const res = await updateStatus.mutateAsync({
      missionId: id,
      status: newStatus,
    });
    if (res.success) window.location.reload();
  }

  async function handleReview() {
    const res = await submitReview.mutateAsync({
      missionId: id,
      rating,
      comment,
    });
    if (res.success) window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/missions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
              Mission #{m.reference ?? id.slice(0, 8)}
            </h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                m.status === "DELIVERED" && "bg-green-100 text-green-800",
                m.status === "IN_TRANSIT" && "bg-blue-100 text-blue-800 animate-pulse",
                m.status === "LOADING" && "bg-orange-100 text-orange-800",
                m.status === "ASSIGNED" && "bg-gray-100 text-gray-800"
              )}
            >
              {STATUS_LABELS[m.status] ?? m.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {m.request?.originCity} → {m.request?.destCity}
          </p>
        </div>
        {canUpdateStatus && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button style={{ backgroundColor: GOLD, color: NAVY }}>
                Mettre à jour le statut
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(NEXT_STATUS[m.status]!)}
              >
                → {STATUS_LABELS[NEXT_STATUS[m.status]!]}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button variant="outline" asChild>
          <Link href={`/dashboard/missions/${id}/tracking`}>
            <Navigation className="h-4 w-4 mr-2" />
            Tracker en temps réel
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {m.request?.originCity}, {m.request?.originCountry} →{" "}
                {m.request?.destCity}, {m.request?.destCountry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{m.request?.goodsType}</span>
              {m.vehicle && (
                <span className="text-muted-foreground">• {m.vehicle.plateNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Transporteur : {m.carrier?.full_name ?? "—"}</span>
              {m.carrier?.phone && (
                <a
                  href={`tel:${m.carrier.phone}`}
                  className="text-sm text-primary hover:underline"
                >
                  {m.carrier.phone}
                </a>
              )}
            </div>
            <p className="text-lg font-bold" style={{ color: NAVY }}>
              {formatXOF(price)}
            </p>
          </CardContent>
        </Card>
      </div>

      {canReview && (
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4" style={{ color: NAVY }}>
              Noter cette mission
            </h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      r <= rating ? "fill-[#F5A623] text-[#F5A623]" : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Commentaire (optionnel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[80px] rounded-md border px-3 py-2 text-sm"
            />
            <Button
              className="mt-2"
              style={{ backgroundColor: GOLD, color: NAVY }}
              onClick={handleReview}
              disabled={rating === 0 || submitReview.isPending}
            >
              Envoyer la note
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
