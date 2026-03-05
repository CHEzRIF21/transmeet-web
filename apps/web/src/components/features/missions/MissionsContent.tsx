"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Truck,
  Calendar,
  User,
  ChevronRight,
  MapPin,
  ChevronDown,
  Star,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/database.types";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type MissionStatus = "confirmee" | "chargement" | "en_transit" | "livree";

interface MockMission {
  id: string;
  ref: string;
  status: MissionStatus;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  departureDate: string;
  arrivalDate: string;
  truckType: string;
  truckPlate: string;
  carrierName: string;
  canRate?: boolean;
  userRating?: number | null;
}

const MOCK_MISSIONS: MockMission[] = [
  {
    id: "1",
    ref: "MSN-2024-001",
    status: "confirmee",
    originCity: "Cotonou",
    destinationCity: "Lomé",
    distanceKm: 145,
    departureDate: "15 mars 2025",
    arrivalDate: "16 mars 2025",
    truckType: "Porteur 10T",
    truckPlate: "BN-1234-A",
    carrierName: "Trans Bénin Express",
    canRate: false,
  },
  {
    id: "2",
    ref: "MSN-2024-002",
    status: "chargement",
    originCity: "Porto-Novo",
    destinationCity: "Accra",
    distanceKm: 380,
    departureDate: "18 mars 2025",
    arrivalDate: "20 mars 2025",
    truckType: "Plateau 20T",
    truckPlate: "TG-5678-B",
    carrierName: "Logistics Sahel",
    canRate: false,
  },
  {
    id: "3",
    ref: "MSN-2024-003",
    status: "en_transit",
    originCity: "Lomé",
    destinationCity: "Ouagadougou",
    distanceKm: 720,
    departureDate: "12 mars 2025",
    arrivalDate: "15 mars 2025",
    truckType: "Frigorifique 15T",
    truckPlate: "BF-9012-C",
    carrierName: "Flotte Ouest SARL",
    canRate: false,
  },
  {
    id: "4",
    ref: "MSN-2024-004",
    status: "livree",
    originCity: "Niamey",
    destinationCity: "Cotonou",
    distanceKm: 950,
    departureDate: "1 mars 2025",
    arrivalDate: "5 mars 2025",
    truckType: "Plateau 25T",
    truckPlate: "NE-3456-D",
    carrierName: "Afrique Transport",
    canRate: true,
    userRating: null,
  },
  {
    id: "5",
    ref: "MSN-2024-005",
    status: "livree",
    originCity: "Abidjan",
    destinationCity: "Bamako",
    distanceKm: 1100,
    departureDate: "20 févr. 2025",
    arrivalDate: "25 févr. 2025",
    truckType: "Porteur 10T",
    truckPlate: "CI-7890-E",
    carrierName: "Trans Ouest Afrique",
    canRate: true,
    userRating: 4,
  },
];

const TIMELINE_STEPS: { key: MissionStatus; label: string }[] = [
  { key: "confirmee", label: "Confirmée" },
  { key: "chargement", label: "Chargement" },
  { key: "en_transit", label: "En transit" },
  { key: "livree", label: "Livrée" },
];

const STATUS_ORDER: MissionStatus[] = [
  "confirmee",
  "chargement",
  "en_transit",
  "livree",
];

function getStepIndex(status: MissionStatus): number {
  return STATUS_ORDER.indexOf(status);
}

interface MissionsContentProps {
  role: AppRole;
}

export function MissionsContent({ role }: MissionsContentProps) {
  const [statusFilter, setStatusFilter] = useState<MissionStatus | "toutes">(
    "toutes"
  );
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [hoverRating, setHoverRating] = useState<Record<string, number>>({});

  const filteredMissions = useMemo(() => {
    if (statusFilter === "toutes") return MOCK_MISSIONS;
    return MOCK_MISSIONS.filter((m) => m.status === statusFilter);
  }, [statusFilter]);

  const isExpediteur = role === "expediteur";
  const isTransporteur = role === "transporteur";

  const handleRate = (missionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [missionId]: rating }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: NAVY }}
        >
          Mes missions
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("toutes")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
              statusFilter === "toutes"
                ? "text-white"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
            style={statusFilter === "toutes" ? { backgroundColor: NAVY } : undefined}
          >
            Toutes
          </button>
          {TIMELINE_STEPS.map((step) => (
            <button
              key={step.key}
              onClick={() => setStatusFilter(step.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                statusFilter === step.key
                  ? "text-white"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              style={
                statusFilter === step.key ? { backgroundColor: NAVY } : undefined
              }
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mission cards */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {filteredMissions.map((mission) => {
          const currentStepIndex = getStepIndex(mission.status);
          const displayRating =
            ratings[mission.id] ?? mission.userRating ?? 0;
          const hover = hoverRating[mission.id] ?? 0;
          const showRating =
            isExpediteur && mission.status === "livree" && mission.canRate;

          return (
            <Card
              key={mission.id}
              className="overflow-hidden transition-all hover:shadow-md"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
              }}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  {/* ID + Status timeline */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: NAVY }}
                    >
                      #{mission.ref}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-0">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isActive = idx === currentStepIndex;
                      const isCompleted = idx < currentStepIndex;
                      return (
                        <div key={step.key} className="flex flex-1 items-center">
                          <div
                            className={cn(
                              "flex-1 rounded-full px-2 py-1.5 text-center text-[10px] font-semibold transition-colors",
                              isActive && "ring-2 ring-offset-1"
                            )}
                            style={{
                              backgroundColor: isActive
                                ? GOLD
                                : isCompleted
                                  ? "rgba(27,43,94,0.25)"
                                  : "rgba(27,43,94,0.08)",
                              color: isActive
                                ? NAVY
                                : isCompleted
                                  ? NAVY
                                  : "#94a3b8",
                              ...(isActive && {
                                boxShadow: `0 0 0 2px ${GOLD}40`,
                              }),
                            }}
                          >
                            {step.label}
                          </div>
                          {idx < TIMELINE_STEPS.length - 1 && (
                            <div
                              className="h-0.5 flex-[0.5] min-w-[4px] mx-0.5 rounded"
                              style={{
                                backgroundColor:
                                  idx < currentStepIndex
                                    ? "rgba(27,43,94,0.4)"
                                    : "rgba(27,43,94,0.12)",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{mission.originCity}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">
                      {mission.destinationCity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {mission.distanceKm} km
                    </span>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Départ : {mission.departureDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Arrivée : {mission.arrivalDate}
                    </span>
                  </div>

                  {/* Truck */}
                  <div className="flex items-center gap-1.5 text-sm">
                    <Truck className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>
                      {mission.truckType} — {mission.truckPlate}
                    </span>
                  </div>

                  {/* Carrier (expediteur only) */}
                  {isExpediteur && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span>{mission.carrierName}</span>
                    </div>
                  )}

                  {/* Rating (expediteur, livree only) */}
                  {showRating && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <span className="text-sm font-medium text-muted-foreground">
                        Noter la mission :
                      </span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRate(mission.id, star)}
                            onMouseEnter={() =>
                              setHoverRating((p) => ({ ...p, [mission.id]: star }))
                            }
                            onMouseLeave={() =>
                              setHoverRating((p) => ({ ...p, [mission.id]: 0 }))
                            }
                            className="p-0.5 transition-transform hover:scale-110"
                          >
                            <Star
                              className={cn(
                                "h-5 w-5 transition-colors",
                                (hover || displayRating) >= star
                                  ? "fill-current"
                                  : "fill-none"
                              )}
                              style={{
                                color:
                                  (hover || displayRating) >= star
                                    ? GOLD
                                    : "#cbd5e1",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                    <Button
                      size="sm"
                      className="gap-1 font-medium"
                      style={{ backgroundColor: GOLD, color: NAVY }}
                      asChild
                    >
                      <Link href={`/dashboard/missions/${mission.id}/tracking`}>
                        <Navigation className="h-3.5 w-3.5" />
                        Tracker en temps réel
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" asChild>
                      <Link href={`/dashboard/missions/${mission.id}`}>
                        Voir détails
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    {isTransporteur && mission.status !== "livree" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            style={{ borderColor: NAVY, color: NAVY }}
                          >
                            Mettre à jour le statut
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[200px]">
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer"
                          >
                            Chargement en cours
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer"
                          >
                            En transit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {}}
                            className="cursor-pointer"
                          >
                            Livré
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <Card
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}
        >
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${NAVY}12` }}
          >
            <Truck className="h-12 w-12" style={{ color: NAVY }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: NAVY }}>
            Aucune mission
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Aucune mission ne correspond à ce filtre pour le moment.
          </p>
        </Card>
      )}
    </div>
  );
}
