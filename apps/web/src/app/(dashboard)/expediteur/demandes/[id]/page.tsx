"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck, Calendar, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useTransportRequest } from "@/lib/api/transport-requests";
import { useOffersByRequest, useAcceptOffer } from "@/lib/api/offers";
import { formatXOF } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

export default function DemandeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { accessToken } = useProfile();
  const { data: demande, isLoading } = useTransportRequest(id, accessToken);
  const { data: offers = [] } = useOffersByRequest(id, accessToken);
  const acceptOffer = useAcceptOffer(accessToken);

  if (isLoading || !demande) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const req = demande as {
    id: string;
    reference?: string | null;
    status: string;
    originCity: string;
    destCity: string;
    originCountry?: string;
    destCountry?: string;
    goodsType: string;
    weightTons: number | { toNumber?: () => number };
    proposedPrice: number | { toNumber?: () => number };
    pickupDate: string;
    specialNotes?: string | null;
    offers?: Array<{
      id: string;
      proposedPrice: number | { toNumber?: () => number };
      message?: string | null;
      availableDate?: string | null;
      status: string;
      carrier?: { full_name?: string | null; phone?: string | null };
      vehicle?: { plateNumber?: string } | null;
    }>;
  };

  const price = typeof req.proposedPrice === "object" && req.proposedPrice?.toNumber
    ? req.proposedPrice.toNumber()
    : Number(req.proposedPrice);

  type OfferItem = NonNullable<typeof req.offers>[number];
  const allOffers = (req.offers ?? offers) as OfferItem[];
  const pendingOffers = Array.isArray(allOffers)
    ? allOffers.filter((o) => o.status === "PENDING")
    : [];

  async function handleAccept(offerId: string) {
    const res = await acceptOffer.mutateAsync(offerId);
    if (res.success && res.data && typeof res.data === "object" && "id" in res.data) {
      router.push(`/dashboard/missions/${(res.data as { id: string }).id}`);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/expediteur/demandes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            Détail de la demande #{req.reference ?? id.slice(0, 8)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {req.originCity} → {req.destCity}
          </p>
        </div>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}>
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {req.originCity}, {req.originCountry} → {req.destCity},{" "}
                {req.destCountry}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>{req.goodsType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(req.pickupDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          {req.specialNotes && (
            <p className="text-sm text-muted-foreground">{req.specialNotes}</p>
          )}
          <p className="text-lg font-bold" style={{ color: NAVY }}>
            Budget : {formatXOF(price)}
          </p>
        </CardContent>
      </Card>

      {pendingOffers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: NAVY }}>
            Propositions reçues
          </h2>
          <div className="space-y-3">
            {pendingOffers.map((offer) => {
              const p = typeof offer.proposedPrice === "object" && offer.proposedPrice?.toNumber
                ? offer.proposedPrice.toNumber()
                : Number(offer.proposedPrice);
              return (
                <Card key={offer.id} className="p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {offer.carrier?.full_name ?? "Transporteur"}
                        </span>
                      </div>
                      {offer.vehicle && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Véhicule : {offer.vehicle.plateNumber}
                        </p>
                      )}
                      {offer.message && (
                        <p className="text-sm mt-1">{offer.message}</p>
                      )}
                      <p className="text-base font-bold mt-2" style={{ color: NAVY }}>
                        {formatXOF(p)}
                      </p>
                    </div>
                    <Button
                      className="font-semibold"
                      style={{ backgroundColor: GOLD, color: NAVY }}
                      onClick={() => handleAccept(offer.id)}
                      disabled={acceptOffer.isPending}
                    >
                      Accepter
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {pendingOffers.length === 0 && req.status === "PUBLISHED" && (
        <p className="text-muted-foreground">
          Aucune proposition pour le moment. Les transporteurs verront votre
          demande et pourront vous faire des offres.
        </p>
      )}
    </div>
  );
}
