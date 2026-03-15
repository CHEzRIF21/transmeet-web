"use client";

import { useState } from "react";
import {
  Percent,
  MapPin,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

interface CommissionType {
  id: string;
  label: string;
  value: number;
}

interface ZoneItem {
  id: string;
  name: string;
  type: "pays" | "ville";
  active: boolean;
}

interface NotifItem {
  id: string;
  label: string;
  enabled: boolean;
}

const MOCK_COMMISSIONS: CommissionType[] = [
  { id: "standard", label: "Mission standard", value: 5 },
  { id: "express", label: "Mission express", value: 7 },
  { id: "frigo", label: "Transport frigorifique", value: 6 },
];

const MOCK_ZONES: ZoneItem[] = [
  { id: "1", name: "Bénin", type: "pays", active: true },
  { id: "2", name: "Togo", type: "pays", active: true },
  { id: "2b", name: "Niger", type: "pays", active: true },
  { id: "3", name: "Ghana", type: "pays", active: true },
  { id: "4", name: "Burkina Faso", type: "pays", active: false },
  { id: "5", name: "Cotonou", type: "ville", active: true },
  { id: "6", name: "Lomé", type: "ville", active: true },
  { id: "6b", name: "Niamey", type: "ville", active: true },
  { id: "7", name: "Accra", type: "ville", active: true },
  { id: "8", name: "Porto-Novo", type: "ville", active: false },
];

const MOCK_NOTIFS: NotifItem[] = [
  { id: "new_mission", label: "Nouvelle mission assignée", enabled: true },
  { id: "payment", label: "Confirmation de paiement", enabled: true },
  { id: "status", label: "Mise à jour statut mission", enabled: true },
  { id: "kyc", label: "Demande KYC en attente", enabled: false },
  { id: "newsletter", label: "Newsletter hebdomadaire", enabled: false },
];

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        checked ? "bg-primary" : "bg-muted"
      )}
      style={checked ? { backgroundColor: NAVY } : undefined}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export function ParametresContent() {
  const [commissions, setCommissions] = useState(MOCK_COMMISSIONS);
  const [zones, setZones] = useState(MOCK_ZONES);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceConfirm, setMaintenanceConfirm] = useState("");

  const handleCommissionChange = (id: string, value: number) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
    );
  };

  const toggleZone = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, active: !z.active } : z))
    );
  };

  const toggleNotif = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleMaintenance = () => {
    setMaintenanceConfirm("");
    setMaintenanceOpen(false);
  };

  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: NAVY }}
      >
        Paramètres de la plateforme
      </h1>

      {/* Commissions */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Percent className="h-5 w-5" style={{ color: NAVY }} />
            <CardTitle style={{ color: NAVY }}>Commissions</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Pourcentage de commission Transmeet par type de mission
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {commissions.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <Label htmlFor={c.id}>{c.label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={c.id}
                  type="number"
                  min={0}
                  max={100}
                  value={c.value}
                  onChange={(e) =>
                    handleCommissionChange(c.id, parseInt(e.target.value, 10) || 0)
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Zones */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" style={{ color: NAVY }} />
            <CardTitle style={{ color: NAVY }}>Zones de couverture</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Pays et villes actifs sur la plateforme
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {zones.map((z) => (
              <div
                key={z.id}
                className="flex items-center gap-2 rounded-lg border px-4 py-2"
              >
                <span className="text-sm font-medium">{z.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({z.type === "pays" ? "Pays" : "Ville"})
                </span>
                <ToggleSwitch
                  checked={z.active}
                  onChange={() => toggleZone(z.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" style={{ color: NAVY }} />
            <CardTitle style={{ color: NAVY }}>
              Notifications système
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Emails automatiques envoyés aux utilisateurs
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifs.map((n) => (
            <div
              key={n.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <Label htmlFor={n.id} className="cursor-pointer flex-1">
                {n.label}
              </Label>
              <ToggleSwitch
                checked={n.enabled}
                onChange={() => toggleNotif(n.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle style={{ color: NAVY }}>Maintenance</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Activer le mode maintenance pour restreindre l&apos;accès à la plateforme
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            onClick={() => setMaintenanceOpen(true)}
          >
            <AlertTriangle className="h-4 w-4" />
            Mode maintenance
          </Button>
        </CardContent>
      </Card>

      {/* Maintenance confirmation modal */}
      <Dialog open={maintenanceOpen} onOpenChange={setMaintenanceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: NAVY }}>
              Activer le mode maintenance
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Cette action affichera une page de maintenance à tous les
              utilisateurs. Confirmez en tapant &quot;MAINTENANCE&quot;.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirmation</Label>
              <Input
                id="confirm"
                placeholder="MAINTENANCE"
                value={maintenanceConfirm}
                onChange={(e) =>
                  setMaintenanceConfirm(e.target.value.toUpperCase())
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaintenanceOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleMaintenance}
              disabled={maintenanceConfirm !== "MAINTENANCE"}
            >
              Activer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
