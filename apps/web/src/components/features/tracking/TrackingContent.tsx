"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Navigation,
  CheckCircle2,
  Radio,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import {
  useMission,
  useMissionTracking,
  useSendTrackingPosition,
} from "@/lib/api/missions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { LatLng } from "./MissionMap";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

const MissionMap = dynamic(() => import("./MissionMap").then((m) => m.MissionMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-muted bg-muted/20">
      <p className="text-muted-foreground">Chargement de la carte...</p>
    </div>
  ),
});

const ORIGIN: LatLng = { lat: 6.357, lng: 2.442 };
const DEST: LatLng = { lat: 6.1256, lng: 1.2222 };

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

interface TrackingContentProps {
  missionId: string;
}

export function TrackingContent({ missionId }: TrackingContentProps) {
  const { accessToken, profile } = useProfile();
  const { data: mission } = useMission(missionId, accessToken);
  const { data: positions = [], refetch: refetchPositions } =
    useMissionTracking(missionId, accessToken);
  const sendPosition = useSendTrackingPosition(accessToken);

  const [truckPosition, setTruckPosition] = useState<LatLng | null>(null);
  const [trail, setTrail] = useState<LatLng[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const m = mission as { request?: { originCity: string; destCity: string } } | null;
  const originCity = m?.request?.originCity ?? "Cotonou";
  const destCity = m?.request?.destCity ?? "Lomé";

  const ORIGIN: LatLng = { lat: 6.357, lng: 2.442 };
  const DEST: LatLng = { lat: 6.1256, lng: 1.2222 };

  useEffect(() => {
    if (positions.length > 0) {
      const last = positions[positions.length - 1] as {
        latitude: number | { toNumber?: () => number };
        longitude: number | { toNumber?: () => number };
        speedKmh?: number | { toNumber?: () => number } | null;
        locality?: string | null;
        createdAt: string;
      };
      const lat = typeof last.latitude === "object" && last.latitude?.toNumber
        ? last.latitude.toNumber()
        : Number(last.latitude);
      const lng = typeof last.longitude === "object" && last.longitude?.toNumber
        ? last.longitude.toNumber()
        : Number(last.longitude);
      setTruckPosition({ lat, lng });
      setTrail(
        (positions as Array<{ latitude: unknown; longitude: unknown }>).map((p) => ({
          lat: Number(p.latitude),
          lng: Number(p.longitude),
        }))
      );
      setLastUpdate(new Date(last.createdAt));
      const sp = last.speedKmh;
      setSpeedKmh(
        typeof sp === "object" && sp?.toNumber ? sp.toNumber() : Number(sp ?? 0)
      );
    } else {
      setTruckPosition(null);
      setTrail([]);
    }
  }, [positions]);

  useEffect(() => {
    if (!accessToken) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`tracking-${missionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tracking_positions",
          filter: `missionId=eq.${missionId}`,
        },
        () => refetchPositions()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [missionId, accessToken, refetchPositions]);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation || !accessToken) return;
    const id = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const speed = pos.coords.speed ? pos.coords.speed * 3.6 : undefined;
        await sendPosition.mutateAsync({
          missionId,
          latitude: lat,
          longitude: lng,
          speedKmh: speed,
        });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );
    setWatching(true);
    watchIdRef.current = id;
  }, [missionId, accessToken, sendPosition]);

  const stopSharing = useCallback(() => {
    const id = watchIdRef.current;
    if (id != null) navigator.geolocation.clearWatch(id);
    setWatching(false);
  }, []);

  const distanceRemaining = useMemo(() => {
    if (!truckPosition) return 0;
    return Math.round(haversineKm(truckPosition, DEST));
  }, [truckPosition, DEST]);

  const totalDistance = haversineKm(ORIGIN, DEST);
  const progress = truckPosition ? Math.max(0, 1 - distanceRemaining / totalDistance) : 0;

  const lastUpdateMin = useMemo(() => {
    if (!lastUpdate) return null;
    const diff = (Date.now() - lastUpdate.getTime()) / 60000;
    return Math.floor(diff);
  }, [lastUpdate]);

  const etaMinutes = useMemo(() => {
    if (speedKmh <= 0) return 0;
    return Math.round((distanceRemaining / speedKmh) * 60);
  }, [distanceRemaining, speedKmh]);

  const etaFormatted = useMemo(() => {
    const h = Math.floor(etaMinutes / 60);
    const m = etaMinutes % 60;
    if (h > 0) return `${h}h${m > 0 ? `${m}min` : ""}`;
    return `${m}min`;
  }, [etaMinutes]);

  const isTransporteur = profile?.role?.toLowerCase() === "transporteur";

  const timelineEvents = [
    { time: "14:00", label: "Chargement terminé à Cotonou", done: true },
    { time: "14:35", label: "Départ effectif", done: true },
    { time: "15:47", label: "Passage frontière Sémè-Kraké ✓", done: true },
    { time: "En attente", label: "Arrivée Lomé", done: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/missions/${missionId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: NAVY }}
            >
              Suivi mission #MSN-{missionId}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                "bg-green-100 text-green-800 animate-pulse"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              En transit
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cotonou → Lomé
          </p>
        </div>
      </div>

      {/* Map */}
      {isTransporteur && (
        <div className="flex gap-2">
          {!watching ? (
            <Button
              style={{ backgroundColor: GOLD, color: NAVY }}
              onClick={startSharing}
              className="gap-2"
            >
              <Radio className="h-4 w-4" />
              Activer le partage de position
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopSharing} className="gap-2">
              <Square className="h-4 w-4" />
              Arrêter le partage
            </Button>
          )}
        </div>
      )}

      <div className="rounded-xl overflow-hidden border shadow-sm">
        <MissionMap
          origin={ORIGIN}
          destination={DEST}
          truckPosition={truckPosition ?? ORIGIN}
          className="h-[400px]"
        />
      </div>

      {/* Progress bar */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardContent className="p-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Cotonou</span>
              <span className="text-muted-foreground">
                Arrivée estimée dans {etaFormatted}
              </span>
              <span className="font-medium">Lomé</span>
            </div>
            <div className="relative h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: GOLD,
                }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {Math.round(progress * 100)}% du trajet
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Dernière position
              </span>
            </div>
            <p className="mt-1 font-semibold" style={{ color: NAVY }}>
              {truckPosition
                ? `${truckPosition.lat.toFixed(4)}, ${truckPosition.lng.toFixed(4)}`
                : "—"}
              {lastUpdateMin != null ? ` — il y a ${lastUpdateMin} min` : ""}
            </p>
          </CardContent>
        </Card>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Vitesse moyenne
              </span>
            </div>
            <p className="mt-1 font-semibold" style={{ color: NAVY }}>
              {speedKmh > 0 ? `${Math.round(speedKmh)} km/h` : "—"}
            </p>
          </CardContent>
        </Card>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Distance restante
              </span>
            </div>
            <p className="mt-1 font-semibold" style={{ color: NAVY }}>
              {distanceRemaining} km
            </p>
          </CardContent>
        </Card>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Statut chauffeur
              </span>
            </div>
            <p className="mt-1 font-semibold" style={{ color: NAVY }}>
              {watching ? "Partage actif" : "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardContent className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: NAVY }}>
            Chronologie
          </h3>
          <div className="space-y-0">
            {timelineEvents.map((evt, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full shrink-0",
                      evt.done ? "bg-green-500" : "bg-muted"
                    )}
                  />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-px flex-1 min-h-[24px] bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-medium text-muted-foreground">
                    {evt.time}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      evt.done ? "" : "text-muted-foreground"
                    )}
                  >
                    {evt.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
