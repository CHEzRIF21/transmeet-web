"use client";

import Link from "next/link";
import {
  Truck,
  TrendingUp,
  Users,
  Star,
  Plus,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExpediteurStats, useExpediteurMissions } from "@/lib/api/dashboard";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { formatXOF } from "@/lib/utils";
import type { MissionListItem } from "@/app/actions/dashboard";

function statusToVariant(
  status: string
): "warning" | "info" | "success" | "destructive" {
  if (status.includes("Livré")) return "success";
  if (status.includes("transit") || status.includes("douane") || status.includes("Chargement"))
    return "info";
  if (status.includes("Litige")) return "destructive";
  return "warning";
}

const KPI_CONFIG = [
  { key: "missions" as const, label: "Missions en cours", icon: Truck, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { key: "revenus" as const, label: "Revenus générés", icon: TrendingUp, iconBg: "bg-green-100", iconColor: "text-green-700" },
  { key: "transporteurs" as const, label: "Transporteurs actifs", icon: Users, iconBg: "bg-accent/15", iconColor: "text-accent" },
  { key: "satisfaction" as const, label: "Satisfaction moyenne", icon: Star, iconBg: "bg-yellow-100", iconColor: "text-yellow-600" },
];

interface ExpediteurDashboardContentProps {
  userId: string;
}

export function ExpediteurDashboardContent({ userId }: ExpediteurDashboardContentProps) {
  const { data: stats, isLoading: statsLoading } = useExpediteurStats(userId);
  const { data: missions = [], isLoading: missionsLoading } = useExpediteurMissions(userId);

  const isLoading = statsLoading || missionsLoading;

  if (isLoading) {
    return <DashboardSkeleton kpiCount={4} showMissions />;
  }

  const kpiValues = {
    missions: stats?.missionsEnCours ?? 0,
    revenus: stats?.revenusGeneres ?? 0,
    transporteurs: stats?.transporteursActifs ?? 0,
    satisfaction: stats?.satisfactionMoyenne ?? 0,
  };

  const kpiChange: Record<string, string> = {
    missions: "+2 cette semaine",
    revenus: "+18% ce mois",
    transporteurs: "partenaires fiables",
    satisfaction: "sur vos dernières missions",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenue — gérez vos demandes de transport et suivez vos missions.
          </p>
        </div>
        <Button variant="accent" size="default" className="gap-2" asChild>
          <Link href="/expediteur/demandes/nouvelle">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CONFIG.map((kpi) => {
          const value =
            kpi.key === "revenus"
              ? formatXOF(kpiValues.revenus)
              : kpi.key === "satisfaction"
                ? `${kpiValues.satisfaction}%`
                : String(kpiValues[kpi.key]);
          return (
            <Card
              key={kpi.key}
              className="border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {kpi.label}
                    </p>
                    <p className="text-xl font-bold tracking-tight text-foreground">
                      {value}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground/80">
                      {kpiChange[kpi.key]}
                    </p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBg}`}
                  >
                    <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between px-5 pb-3 pt-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Mes missions récentes
            </h2>
            <p className="text-xs text-muted-foreground">
              {missions.length} missions au total
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/missions" className="gap-1">
              Voir tout
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>

        <div className="px-5 pb-5">
          <MissionTable missions={missions} />
        </div>
      </Card>
    </div>
  );
}

function MissionTable({ missions }: { missions: MissionListItem[] }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-primary/10 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 text-left">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Réf.</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trajet</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cargaison</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Transporteur</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {missions.map((mission) => (
              <tr key={mission.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs font-medium text-primary">
                  {mission.ref}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span>{mission.origin}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{mission.destination}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {mission.cargo}
                </td>
                <td className="px-4 py-3 text-xs text-foreground">
                  {mission.transporteur}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {mission.date}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusToVariant(mission.status)}>
                    {mission.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="rounded-lg border border-primary/10 bg-muted/20 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">
                {mission.ref}
              </span>
              <Badge variant={statusToVariant(mission.status)}>
                {mission.status}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              {mission.origin} → {mission.destination}
            </div>
            <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
              <span>{mission.cargo}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {mission.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
