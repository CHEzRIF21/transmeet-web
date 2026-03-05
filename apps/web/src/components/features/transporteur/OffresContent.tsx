"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  User,
  Star,
  Clock,
  Send,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatXOF } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type TruckType =
  | "conteneur"
  | "plateau"
  | "citerne"
  | "benne"
  | "frigo"
  | "marchandise";

type PropositionStatus = "en_attente" | "accepte" | "refuse";

interface MockOffer {
  id: string;
  demandRef: string;
  originCity: string;
  originRegion: string;
  destinationCity: string;
  destinationRegion: string;
  distanceKm: number;
  truckType: TruckType;
  tonnage: number;
  loadingDate: string;
  budgetCfa: number;
  expediteurName: string;
  expediteurRating: number;
  expiresAt: string; // ISO string for countdown
}

interface MockProposition {
  id: string;
  offerId: string;
  offerRef: string;
  trajet: string;
  priceCfa: number;
  status: PropositionStatus;
  sentAt: string;
}

const TRUCK_TYPES: { key: TruckType; label: string }[] = [
  { key: "conteneur", label: "Conteneur" },
  { key: "plateau", label: "Plateau" },
  { key: "citerne", label: "Citerne" },
  { key: "benne", label: "Benne" },
  { key: "frigo", label: "Frigo" },
  { key: "marchandise", label: "Marchandise" },
];

const MOCK_OFFERS: MockOffer[] = [
  {
    id: "1",
    demandRef: "DEM-2024-015",
    originCity: "Cotonou",
    originRegion: "Bénin",
    destinationCity: "Lomé",
    destinationRegion: "Togo",
    distanceKm: 145,
    truckType: "plateau",
    tonnage: 20,
    loadingDate: "18 mars 2025",
    budgetCfa: 450000,
    expediteurName: "Agro Bénin SARL",
    expediteurRating: 4.5,
    expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    demandRef: "DEM-2024-016",
    originCity: "Porto-Novo",
    originRegion: "Bénin",
    destinationCity: "Accra",
    destinationRegion: "Ghana",
    distanceKm: 380,
    truckType: "frigo",
    tonnage: 15,
    loadingDate: "20 mars 2025",
    budgetCfa: 780000,
    expediteurName: "Cold Chain Ltd",
    expediteurRating: 4.2,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    demandRef: "DEM-2024-017",
    originCity: "Lomé",
    originRegion: "Togo",
    destinationCity: "Ouagadougou",
    destinationRegion: "Burkina Faso",
    distanceKm: 720,
    truckType: "benne",
    tonnage: 25,
    loadingDate: "22 mars 2025",
    budgetCfa: 1200000,
    expediteurName: "BTP Afrique",
    expediteurRating: 3.8,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    demandRef: "DEM-2024-018",
    originCity: "Niamey",
    originRegion: "Niger",
    destinationCity: "Cotonou",
    destinationRegion: "Bénin",
    distanceKm: 950,
    truckType: "plateau",
    tonnage: 20,
    loadingDate: "25 mars 2025",
    budgetCfa: 1650000,
    expediteurName: "Trans Sahel",
    expediteurRating: 4.7,
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    demandRef: "DEM-2024-019",
    originCity: "Abidjan",
    originRegion: "Côte d'Ivoire",
    destinationCity: "Bamako",
    destinationRegion: "Mali",
    distanceKm: 1100,
    truckType: "conteneur",
    tonnage: 30,
    loadingDate: "28 mars 2025",
    budgetCfa: 2100000,
    expediteurName: "Logistics CI",
    expediteurRating: 4.0,
    expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    demandRef: "DEM-2024-020",
    originCity: "Accra",
    originRegion: "Ghana",
    destinationCity: "Lagos",
    destinationRegion: "Nigéria",
    distanceKm: 290,
    truckType: "citerne",
    tonnage: 18,
    loadingDate: "15 mars 2025",
    budgetCfa: 520000,
    expediteurName: "Petrol Distribution",
    expediteurRating: 4.3,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_PROPOSITIONS: MockProposition[] = [
  {
    id: "P1",
    offerId: "7",
    offerRef: "DEM-2024-012",
    trajet: "Cotonou → Niamey",
    priceCfa: 950000,
    status: "en_attente",
    sentAt: "14 mars 2025",
  },
  {
    id: "P2",
    offerId: "8",
    offerRef: "DEM-2024-011",
    trajet: "Lomé → Accra",
    priceCfa: 380000,
    status: "accepte",
    sentAt: "12 mars 2025",
  },
  {
    id: "P3",
    offerId: "9",
    offerRef: "DEM-2024-010",
    trajet: "Ouagadougou → Cotonou",
    priceCfa: 720000,
    status: "refuse",
    sentAt: "10 mars 2025",
  },
];

function formatCountdown(expiresAt: string): string {
  const now = new Date();
  const exp = new Date(expiresAt);
  const diff = exp.getTime() - now.getTime();
  if (diff <= 0) return "Expirée";
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (h >= 24) return `J+${Math.floor(h / 24)}`;
  return `${h}h ${m}min`;
}

function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  const [countdown, setCountdown] = useState(formatCountdown(expiresAt));

  useEffect(() => {
    const exp = new Date(expiresAt);
    const diff = exp.getTime() - Date.now();
    if (diff <= 0) return;
    const interval = setInterval(() => {
      setCountdown(formatCountdown(expiresAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const exp = new Date(expiresAt);
  const diff = exp.getTime() - Date.now();
  const expired = diff <= 0;
  const urgent = !expired && diff < 24 * 60 * 60 * 1000;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        expired && "bg-gray-100 text-gray-500",
        urgent && !expired && "bg-orange-100 text-orange-800",
        !expired && !urgent && "bg-muted text-muted-foreground"
      )}
    >
      <Clock className="h-3 w-3" />
      {countdown}
    </span>
  );
}

const PROP_STATUS_CONFIG: Record<
  PropositionStatus,
  { label: string; className: string }
> = {
  en_attente: { label: "En attente", className: "bg-orange-100 text-orange-800" },
  accepte: { label: "Accepté", className: "bg-green-100 text-green-800" },
  refuse: { label: "Refusé", className: "bg-red-100 text-red-800" },
};

export function OffresContent() {
  const [activeTab, setActiveTab] = useState<"offres" | "propositions">("offres");
  const [selectedTypes, setSelectedTypes] = useState<TruckType[]>([]);
  const [regionFilter, setRegionFilter] = useState("");
  const [distanceMax, setDistanceMax] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [ignoredIds, setIgnoredIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOffer, setModalOffer] = useState<MockOffer | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    priceCfa: "",
    message: "",
    availabilityDate: "",
  });

  const toggleType = (t: TruckType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const filteredOffers = useMemo(() => {
    let list = MOCK_OFFERS.filter((o) => !ignoredIds.has(o.id));
    if (selectedTypes.length) {
      list = list.filter((o) => selectedTypes.includes(o.truckType));
    }
    if (regionFilter) {
      list = list.filter(
        (o) =>
          o.originRegion.toLowerCase().includes(regionFilter.toLowerCase()) ||
          o.destinationRegion.toLowerCase().includes(regionFilter.toLowerCase())
      );
    }
    if (distanceMax) {
      const max = parseInt(distanceMax, 10);
      if (!isNaN(max)) list = list.filter((o) => o.distanceKm <= max);
    }
    if (priceMin) {
      const min = parseInt(priceMin, 10);
      if (!isNaN(min)) list = list.filter((o) => o.budgetCfa >= min);
    }
    if (priceMax) {
      const max = parseInt(priceMax, 10);
      if (!isNaN(max)) list = list.filter((o) => o.budgetCfa <= max);
    }
    return list;
  }, [
    selectedTypes,
    regionFilter,
    distanceMax,
    priceMin,
    priceMax,
    ignoredIds,
  ]);

  const openQuoteModal = (offer: MockOffer) => {
    setModalOffer(offer);
    setQuoteForm({
      priceCfa: String(offer.budgetCfa),
      message: "",
      availabilityDate: offer.loadingDate,
    });
    setModalOpen(true);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(false);
    setModalOffer(null);
    setQuoteForm({ priceCfa: "", message: "", availabilityDate: "" });
  };

  const handleIgnore = (id: string) => {
    setIgnoredIds((prev) => new Set(prev).add(id));
  };

  const truckLabel = (k: TruckType) => TRUCK_TYPES.find((t) => t.key === k)?.label ?? k;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: NAVY }}
          >
            Offres disponibles
          </h1>
          <span
            className="rounded-full px-3 py-1 text-sm font-semibold"
            style={{ backgroundColor: `${NAVY}15`, color: NAVY }}
          >
            {filteredOffers.length} actives
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("offres")}
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            activeTab === "offres" ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
          style={activeTab === "offres" ? { backgroundColor: NAVY } : undefined}
        >
          Offres disponibles
        </button>
        <button
          onClick={() => setActiveTab("propositions")}
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            activeTab === "propositions" ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
          style={activeTab === "propositions" ? { backgroundColor: NAVY } : undefined}
        >
          Mes propositions
        </button>
      </div>

      {activeTab === "offres" ? (
        <>
          {/* Filters */}
          <Card
            className="p-4"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <div>
                <Label className="text-xs text-muted-foreground">Type de camion</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {TRUCK_TYPES.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => toggleType(t.key)}
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-medium transition-all",
                        selectedTypes.includes(t.key)
                          ? "text-white"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted"
                      )}
                      style={
                        selectedTypes.includes(t.key)
                          ? { backgroundColor: NAVY }
                          : undefined
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Région départ</Label>
                <Input
                  id="region"
                  placeholder="Ex: Bénin, Lomé..."
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distance">Distance max (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  placeholder="1000"
                  value={distanceMax}
                  onChange={(e) => setDistanceMax(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priceMin">Prix min (FCFA)</Label>
                <Input
                  id="priceMin"
                  type="number"
                  placeholder="300000"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priceMax">Prix max (FCFA)</Label>
                <Input
                  id="priceMax"
                  type="number"
                  placeholder="2000000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Offer cards */}
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {filteredOffers.map((offer) => (
              <Card
                key={offer.id}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
                }}
              >
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-medium text-muted-foreground">
                        #{offer.demandRef}
                      </span>
                      <CountdownBadge expiresAt={offer.expiresAt} />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{offer.originCity}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{offer.destinationCity}</span>
                      <span className="text-xs text-muted-foreground">
                        • {offer.distanceKm} km
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      {truckLabel(offer.truckType)} {offer.tonnage}t
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {offer.loadingDate}
                    </div>
                    <p className="font-bold text-lg" style={{ color: NAVY }}>
                      {formatXOF(offer.budgetCfa)}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{offer.expediteurName}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        {offer.expediteurRating}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1 font-medium"
                        style={{ backgroundColor: GOLD, color: NAVY }}
                        onClick={() => openQuoteModal(offer)}
                      >
                        <Send className="h-3.5 w-3.5" />
                        Proposer un devis
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1 text-muted-foreground"
                        onClick={() => handleIgnore(offer.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                        Ignorer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <Card
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
              style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}
            >
              <p className="text-muted-foreground">
                Aucune offre ne correspond à vos filtres.
              </p>
            </Card>
          )}
        </>
      ) : (
        /* Mes propositions */
        <div className="space-y-4">
          {MOCK_PROPOSITIONS.map((prop) => {
            const statusCfg = PROP_STATUS_CONFIG[prop.status];
            return (
              <Card
                key={prop.id}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
                }}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-medium text-muted-foreground">
                        {prop.offerRef}
                      </p>
                      <p className="font-medium" style={{ color: NAVY }}>
                        {prop.trajet}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatXOF(prop.priceCfa)} • Envoyé le {prop.sentAt}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        statusCfg.className
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quote modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setModalOffer(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: NAVY }}>
              Proposer un devis
            </DialogTitle>
            {modalOffer && (
              <p className="text-sm text-muted-foreground">
                {modalOffer.originCity} → {modalOffer.destinationCity}
              </p>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmitQuote} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="priceCfa">Prix proposé (FCFA)</Label>
              <Input
                id="priceCfa"
                type="number"
                placeholder="450000"
                value={quoteForm.priceCfa}
                onChange={(e) =>
                  setQuoteForm((p) => ({ ...p, priceCfa: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availabilityDate">Date de disponibilité confirmée</Label>
              <Input
                id="availabilityDate"
                placeholder="18 mars 2025"
                value={quoteForm.availabilityDate}
                onChange={(e) =>
                  setQuoteForm((p) => ({ ...p, availabilityDate: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message optionnel à l&apos;expéditeur</Label>
              <Textarea
                id="message"
                placeholder="Précisez les conditions de transport..."
                value={quoteForm.message}
                onChange={(e) =>
                  setQuoteForm((p) => ({ ...p, message: e.target.value }))
                }
                rows={3}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: GOLD, color: NAVY }}
                className="gap-1"
              >
                <Send className="h-3.5 w-3.5" />
                Envoyer ma proposition
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
