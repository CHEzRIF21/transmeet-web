"use client";

import { useState, useCallback, useId, useEffect } from "react";
import {
  Plus,
  Truck,
  Eye,
  Pencil,
  Ban,
  Upload,
  FileCheck,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { useProfile } from "@/hooks/useProfile";
import { useVehicles, useCompanies, useCreateVehicle, useCreateCompany } from "@/lib/api/vehicles";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type VehicleType =
  | "conteneur"
  | "plateau"
  | "citerne"
  | "benne"
  | "frigo"
  | "marchandise";

type VehicleStatus =
  | "disponible"
  | "en_mission"
  | "en_maintenance"
  | "suspendu";

const TYPE_LABELS: Record<string, string> = {
  conteneur: "Conteneur",
  plateau: "Plateau",
  citerne: "Citerne",
  benne: "Benne",
  frigo: "Frigo",
  marchandise: "Marchandise",
  CONTENEUR: "Conteneur",
  PLATEAU: "Plateau",
  CITERNE: "Citerne",
  BENNE: "Benne",
  FRIGO: "Frigo",
  MARCHANDISE: "Marchandise",
};

const STATUS_MAP: Record<string, VehicleStatus> = {
  AVAILABLE: "disponible",
  ON_MISSION: "en_mission",
  MAINTENANCE: "en_maintenance",
  INACTIVE: "suspendu",
};

const STATUS_CONFIG: Record<
  VehicleStatus,
  { label: string; className: string }
> = {
  disponible: {
    label: "Disponible",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  en_mission: {
    label: "En mission",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  en_maintenance: {
    label: "En maintenance",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  suspendu: {
    label: "Suspendu",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

function FileDropZone({
  label,
  onFiles,
  accept,
  multiple = false,
}: {
  label: string;
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const id = useId();
  const inputId = `file-drop-${id}`;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFiles(multiple ? files : [files[0]]);
    },
    [onFiles, multiple]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) onFiles(multiple ? files : [files[0]]);
    e.target.value = "";
  };

  return (
    <label
      htmlFor={inputId}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
      )}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
      />
      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Glissez des fichiers ou cliquez
      </p>
    </label>
  );
}

interface ApiVehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacityTons: number | { toNumber?: () => number };
  status: string;
  documents?: Array<{ type: string; status: string }>;
}

export function FlotteContent() {
  const { accessToken } = useProfile();
  const { data: vehicles = [], isLoading } = useVehicles(accessToken);
  const { data: companies = [] } = useCompanies(accessToken);
  const createVehicle = useCreateVehicle(accessToken);
  const createCompany = useCreateCompany(accessToken);

  const [modalOpen, setModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    plate: "",
    type: "PLATEAU",
    capacity: "",
    companyId: "",
  });
  const [companyName, setCompanyName] = useState("");

  const vehiclesList = vehicles as ApiVehicle[];
  const companiesList = companies as Array<{ id: string; name: string }>;

  const stats = {
    total: vehiclesList.length,
    actifs: vehiclesList.filter(
      (v) => v.status === "AVAILABLE" || v.status === "ON_MISSION"
    ).length,
    enMission: vehiclesList.filter((v) => v.status === "ON_MISSION").length,
  };

  useEffect(() => {
    if (companiesList.length > 0 && !formData.companyId) {
      setFormData((p) => ({ ...p, companyId: companiesList[0].id }));
    }
  }, [companiesList, formData.companyId]);

  const resetForm = () => {
    setFormData({
      plate: "",
      type: "PLATEAU",
      capacity: "",
      companyId: companiesList[0]?.id ?? "",
    });
    setPhotoFile(null);
    setDocFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const companyId = formData.companyId || companiesList[0]?.id;
    if (!companyId) {
      setCompanyModalOpen(true);
      return;
    }
    const res = await createVehicle.mutateAsync({
      companyId,
      plateNumber: formData.plate,
      type: formData.type,
      capacityTons: Number(formData.capacity),
      countryReg: "BEN",
    });
    if (res.success) {
      setModalOpen(false);
      resetForm();
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createCompany.mutateAsync({
      name: companyName,
      type: "TRANSPORTEUR",
      country: "BEN",
    });
    if (res.success && res.data && typeof res.data === "object" && "id" in res.data) {
      setCompanyModalOpen(false);
      setCompanyName("");
      setFormData((p) => ({ ...p, companyId: (res.data as { id: string }).id }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: NAVY }}
        >
          Ma flotte
        </h1>
        <Button
          size="default"
          className="gap-2 font-semibold shadow-md"
          style={{ backgroundColor: GOLD, color: NAVY }}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total véhicules</p>
            <p className="text-2xl font-bold" style={{ color: NAVY }}>
              {stats.total}
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
            <p className="text-sm text-muted-foreground">Actifs</p>
            <p className="text-2xl font-bold" style={{ color: NAVY }}>
              {stats.actifs}
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
            <p className="text-sm text-muted-foreground">En mission</p>
            <p className="text-2xl font-bold" style={{ color: NAVY }}>
              {stats.enMission}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vehiclesList.map((vehicle) => {
          const vStatus = STATUS_MAP[vehicle.status] ?? "disponible";
          const statusCfg = STATUS_CONFIG[vStatus];
          const cap = typeof vehicle.capacityTons === "object" && vehicle.capacityTons?.toNumber
            ? vehicle.capacityTons.toNumber()
            : Number(vehicle.capacityTons);
          return (
            <Card
              key={vehicle.id}
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
              }}
            >
              <CardContent className="p-0 overflow-hidden">
                {/* Photo placeholder */}
                <div
                  className="h-40 flex items-center justify-center bg-muted/30"
                  style={{ backgroundColor: `${NAVY}08` }}
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-12 w-12" />
                    <span className="text-xs">Photo véhicule</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <p
                      className="font-mono font-bold text-lg"
                      style={{ color: NAVY }}
                    >
                      {vehicle.plateNumber}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        statusCfg.className
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {TYPE_LABELS[vehicle.type] ?? vehicle.type} • {cap} t
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    {(vehicle.documents?.length ?? 0) >= 2 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <FileCheck className="h-3.5 w-3.5" />
                        Documents OK ✓
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-orange-600">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Documents manquants ⚠
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      style={{ borderColor: NAVY, color: NAVY }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      Désactiver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}

      {/* Empty state */}
      {!isLoading && vehiclesList.length === 0 && (
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
            Aucun véhicule
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Enregistrez votre premier véhicule pour commencer à recevoir des
            missions.
          </p>
          <Button
            size="lg"
            className="mt-6 gap-2 font-semibold shadow-md"
            style={{ backgroundColor: GOLD, color: NAVY }}
            onClick={() => {
              if (companiesList.length === 0) setCompanyModalOpen(true);
              else setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </Card>
      )}

      {/* Add vehicle modal */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: NAVY }}>
              Ajouter un véhicule
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="plate">Immatriculation</Label>
                <Input
                  id="plate"
                  placeholder="BJ-1234-AB"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, plate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, type: e.target.value }))
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {["PLATEAU", "CITERNE", "FRIGO", "BENNE", "CONTENEUR", "MARCHANDISE"].map((k) => (
                    <option key={k} value={k}>
                      {TYPE_LABELS[k] ?? k}
                    </option>
                  ))}
                </select>
              </div>
              {companiesList.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <select
                    id="company"
                    value={formData.companyId}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, companyId: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {companiesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacité (tonnes)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  placeholder="20"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, capacity: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Photo du véhicule</Label>
                <div className="relative">
                  <FileDropZone
                    label="Photo (JPG, PNG)"
                    accept="image/*"
                    onFiles={(f) => setPhotoFile(f[0] ?? null)}
                  />
                  {photoFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {photoFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Documents (carte grise, assurance, visite technique)</Label>
                <div className="relative">
                  <FileDropZone
                    label="Glissez les documents ou cliquez"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onFiles={setDocFiles}
                  />
                  {docFiles.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {docFiles.length} fichier(s) sélectionné(s)
                    </p>
                  )}
                </div>
              </div>
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
              >
                Ajouter
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create company modal - when no company */}
      <Dialog open={companyModalOpen} onOpenChange={setCompanyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une entreprise</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Vous devez d&apos;abord créer une entreprise pour ajouter des véhicules.
          </p>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="grid gap-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ma société de transport"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" style={{ backgroundColor: GOLD, color: NAVY }}>
                Créer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
