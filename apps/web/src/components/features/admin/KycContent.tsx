"use client";

import { useState } from "react";
import {
  FileText,
  Check,
  X,
  ImageIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

type KycStatus = "en_attente" | "valide" | "rejete";

interface MockKyc {
  id: string;
  carrierName: string;
  docType: string;
  submittedAt: string;
  status: KycStatus;
  rejectMotif?: string;
}

const MOCK_KYC: MockKyc[] = [
  {
    id: "1",
    carrierName: "Trans Bénin Express",
    docType: "Carte d'identité nationale",
    submittedAt: "10 mars 2025",
    status: "en_attente",
  },
  {
    id: "2",
    carrierName: "Logistics Sahel SARL",
    docType: "Passeport",
    submittedAt: "8 mars 2025",
    status: "en_attente",
  },
  {
    id: "3",
    carrierName: "Flotte Ouest",
    docType: "Carte d'identité nationale",
    submittedAt: "5 mars 2025",
    status: "valide",
  },
  {
    id: "4",
    carrierName: "Afrique Transport",
    docType: "Permis de conduire",
    submittedAt: "1 mars 2025",
    status: "rejete",
    rejectMotif: "Document illisible",
  },
  {
    id: "5",
    carrierName: "Trans Ouest Afrique",
    docType: "Passeport",
    submittedAt: "28 févr. 2025",
    status: "valide",
  },
];

const TABS: { key: KycStatus; label: string }[] = [
  { key: "en_attente", label: "En attente" },
  { key: "valide", label: "Validés" },
  { key: "rejete", label: "Rejetés" },
];

const STATUS_CONFIG: Record<KycStatus, { label: string; className: string }> = {
  en_attente: { label: "En attente", className: "bg-orange-100 text-orange-800 border-orange-200" },
  valide: { label: "Validé", className: "bg-green-100 text-green-800 border-green-200" },
  rejete: { label: "Rejeté", className: "bg-red-100 text-red-800 border-red-200" },
};

export function KycContent() {
  const [activeTab, setActiveTab] = useState<KycStatus>("en_attente");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectKycId, setRejectKycId] = useState<string | null>(null);
  const [rejectMotif, setRejectMotif] = useState("");

  const filteredKycs = MOCK_KYC.filter((k) => k.status === activeTab);

  const handleRejectClick = (id: string) => {
    setRejectKycId(id);
    setRejectMotif("");
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = () => {
    setRejectModalOpen(false);
    setRejectKycId(null);
    setRejectMotif("");
  };

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: NAVY }}
      >
        KYC — Validation des documents
      </h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              activeTab === tab.key ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
            style={activeTab === tab.key ? { backgroundColor: NAVY } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KYC cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {filteredKycs.map((kyc) => {
          const statusCfg = STATUS_CONFIG[kyc.status];
          return (
            <Card
              key={kyc.id}
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
              }}
            >
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold" style={{ color: NAVY }}>
                        {kyc.carrierName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {kyc.docType}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        statusCfg.className
                      )}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Soumis le {kyc.submittedAt}
                  </p>
                  {/* Doc preview placeholder */}
                  <div
                    className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20"
                  >
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-10 w-10" />
                      <span className="text-xs">Aperçu document</span>
                    </div>
                  </div>
                  {kyc.status === "en_attente" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                        Valider ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 gap-1"
                        onClick={() => handleRejectClick(kyc.id)}
                      >
                        <X className="h-4 w-4" />
                        Rejeter ✗
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredKycs.length === 0 && (
        <Card
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}
        >
          <FileText
            className="h-12 w-12 mb-4"
            style={{ color: `${NAVY}40` }}
          />
          <h3 className="text-lg font-semibold" style={{ color: NAVY }}>
            Aucun dossier
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aucun dossier KYC dans cette catégorie.
          </p>
        </Card>
      )}

      {/* Reject modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: NAVY }}>
              Rejeter le dossier KYC
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="motif">Motif du rejet (obligatoire)</Label>
              <Textarea
                id="motif"
                placeholder="Ex : Document illisible, informations incohérentes..."
                value={rejectMotif}
                onChange={(e) => setRejectMotif(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectMotif.trim()}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
