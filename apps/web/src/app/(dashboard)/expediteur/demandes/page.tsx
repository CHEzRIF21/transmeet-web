"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, ArrowRight, Truck, Calendar, User, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useTransportRequests } from "@/lib/api/transport-requests";
import { formatXOF, cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

const STATUS_MAP: Record<string, string> = {
  DRAFT: "en_attente",
  PUBLISHED: "en_attente",
  MATCHED: "confirmee",
  IN_PROGRESS: "en_cours",
  COMPLETED: "livree",
  CANCELLED: "annulee",
};

type DemandeStatus =
  | "en_attente"
  | "confirmee"
  | "en_cours"
  | "livree"
  | "annulee";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; pulse?: boolean }
> = {
  en_attente: {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  confirmee: {
    label: "Confirmée",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  en_cours: {
    label: "En cours",
    className: "bg-green-100 text-green-800 border-green-200",
    pulse: true,
  },
  livree: {
    label: "Livrée",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  annulee: {
    label: "Annulée",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const TABS: { key: "toutes" | DemandeStatus; label: string }[] = [
  { key: "toutes", label: "Toutes" },
  { key: "en_attente", label: "En attente" },
  { key: "confirmee", label: "Confirmées" },
  { key: "en_cours", label: "En cours" },
  { key: "livree", label: "Livrées" },
  { key: "annulee", label: "Annulées" },
];

interface TransportRequestItem {
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
  missions?: Array<{ carrier?: { full_name?: string | null } }>;
}

function mapToDemande(d: TransportRequestItem) {
  const status = STATUS_MAP[d.status] ?? "en_attente";
  const price = typeof d.proposedPrice === "object" && d.proposedPrice?.toNumber
    ? d.proposedPrice.toNumber()
    : Number(d.proposedPrice);
  const carrierName = d.missions?.[0]?.carrier?.full_name ?? null;
  return {
    id: d.id,
    ref: d.reference ?? `#${d.id.slice(0, 8)}`,
    status: status as DemandeStatus,
    originCity: d.originCity,
    destinationCity: d.destCity,
    truckType: d.goodsType,
    preferredDate: new Date(d.pickupDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    carrierName,
    priceCfa: carrierName ? price : 0,
  };
}

const ITEMS_PER_PAGE = 4;

export default function ExpediteurDemandesPage() {
  const { accessToken } = useProfile();
  const { data: items = [], isLoading } = useTransportRequests(accessToken);
  const [activeTab, setActiveTab] = useState<"toutes" | DemandeStatus>("toutes");
  const [page, setPage] = useState(1);

  const demandes = useMemo(
    () => (items as TransportRequestItem[]).map(mapToDemande),
    [items]
  );

  const filteredDemandes = useMemo(() => {
    if (activeTab === "toutes") return demandes;
    return demandes.filter((d) => d.status === activeTab);
  }, [demandes, activeTab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { toutes: demandes.length };
    TABS.slice(1).forEach((t) => {
      c[t.key] = demandes.filter((d) => d.status === t.key).length;
    });
    return c;
  }, [demandes]);

  const paginatedDemandes = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredDemandes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDemandes, page]);

  const totalPages = Math.ceil(filteredDemandes.length / ITEMS_PER_PAGE);
  const showPagination = totalPages > 1;
  const isEmpty = filteredDemandes.length === 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: NAVY }}>
          Mes demandes
        </h1>
        <Button
          size="default"
          className="gap-2 font-semibold shadow-md transition-all hover:opacity-90"
          style={{ backgroundColor: GOLD, color: NAVY }}
          asChild
        >
          <Link href="/expediteur/demandes/nouvelle">
            <Plus className="h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto pb-2 -mx-1">
        <div className="flex gap-2 min-w-max px-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.key
                  ? "text-white shadow-md"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              style={
                activeTab === tab.key ? { backgroundColor: NAVY } : undefined
              }
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  activeTab === tab.key ? "bg-white/25" : "bg-muted"
                )}
              >
                {counts[tab.key] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <Card
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${NAVY}12` }}
          >
            <Truck className="h-12 w-12" style={{ color: NAVY }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: NAVY }}>
            Aucune demande pour le moment
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Créez votre première demande de transport pour connecter votre
            cargaison aux transporteurs de la plateforme.
          </p>
          <Button
            size="lg"
            className="mt-6 gap-2 font-semibold shadow-md"
            style={{ backgroundColor: GOLD, color: NAVY }}
            asChild
          >
            <Link href="/expediteur/demandes/nouvelle">
              <Plus className="h-4 w-4" />
              Créer ma première demande
            </Link>
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {paginatedDemandes.map((demande) => {
              const statusCfg =
                STATUS_CONFIG[demande.status] ?? STATUS_CONFIG.en_attente;
              return (
                <Card
                  key={demande.id}
                  className="overflow-hidden transition-all hover:shadow-md"
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
                  }}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className="font-mono text-sm font-bold"
                          style={{ color: NAVY }}
                        >
                          #{demande.ref}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                            statusCfg.className,
                            statusCfg.pulse && "animate-pulse"
                          )}
                        >
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{demande.originCity}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="font-medium">
                          {demande.destinationCity}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-3.5 w-3.5" />
                          {demande.truckType}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {demande.preferredDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span>
                          {demande.carrierName ?? "En recherche..."}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span
                          className="text-base font-bold"
                          style={{ color: NAVY }}
                        >
                          {demande.priceCfa > 0
                            ? formatXOF(demande.priceCfa)
                            : "—"}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <Link href={`/expediteur/demandes/${demande.id}`}>
                            Voir détails
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {showPagination && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Précédent
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
