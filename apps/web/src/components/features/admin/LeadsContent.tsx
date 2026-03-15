"use client";

import { useState } from "react";
import { Search, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useProfile } from "@/hooks/useProfile";
import { useAdminLeads } from "@/lib/api/admin";
import type { Lead } from "@transmit/types";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const LIMIT = 25;

type LeadTypeFilter = "ALL" | "EXPEDITEUR" | "TRANSPORTEUR" | "BTP" | "CONTACT";

const TYPE_OPTIONS: { key: LeadTypeFilter; label: string }[] = [
  { key: "ALL", label: "Tous" },
  { key: "EXPEDITEUR", label: "Expéditeur" },
  { key: "TRANSPORTEUR", label: "Transporteur" },
  { key: "BTP", label: "BTP" },
  { key: "CONTACT", label: "Contact" },
];

const TYPE_BADGE_VARIANT: Record<string, "default" | "secondary" | "accent" | "info" | "warning"> = {
  EXPEDITEUR: "info",
  TRANSPORTEUR: "accent",
  BTP: "warning",
  CONTACT: "secondary",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function truncate(str: string | null | undefined, max: number) {
  if (!str) return "—";
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

function contactDisplay(lead: Lead) {
  if (lead.email) return lead.email;
  if (lead.phone) return lead.phone;
  return "—";
}

function nameOrCompany(lead: Lead) {
  if (lead.name) return lead.name;
  if (lead.company) return lead.company;
  return "—";
}

export function LeadsContent() {
  const { accessToken } = useProfile();
  const [typeFilter, setTypeFilter] = useState<LeadTypeFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const params = {
    type: typeFilter,
    search: search.trim() || undefined,
    page,
  };

  const { data, isLoading } = useAdminLeads(accessToken, params);
  const leads = data?.data ?? [];
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight" style={{ color: NAVY }}>
        Leads
      </h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email, société, téléphone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={typeFilter === opt.key ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setTypeFilter(opt.key);
                setPage(1);
              }}
              style={typeFilter === opt.key ? { backgroundColor: NAVY } : undefined}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left"
                style={{ backgroundColor: `${NAVY}08` }}
              >
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nom / Société
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contact
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aperçu message
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer transition-colors hover:bg-muted/30"
                    onClick={() => handleRowClick(lead)}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          TYPE_BADGE_VARIANT[lead.type] ?? "default"
                        }
                        className="capitalize"
                      >
                        {lead.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {nameOrCompany(lead)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {contactDisplay(lead)}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                      {truncate(lead.message, 60)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Inbox
              className="mb-4 h-12 w-12 text-muted-foreground"
              style={{ color: `${NAVY}40` }}
            />
            <p className="text-muted-foreground">Aucun lead trouvé.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages} ({total} lead{total !== 1 ? "s" : ""})
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle style={{ color: NAVY }}>
              Détail du lead
            </SheetTitle>
          </SheetHeader>
          {selectedLead && (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </p>
                <Badge
                  variant={TYPE_BADGE_VARIANT[selectedLead.type] ?? "default"}
                  className="mt-1 capitalize"
                >
                  {selectedLead.type}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </p>
                <p className="mt-1">{formatDate(selectedLead.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Nom
                </p>
                <p className="mt-1">{selectedLead.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Société
                </p>
                <p className="mt-1">{selectedLead.company ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="mt-1">{selectedLead.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Téléphone
                </p>
                <p className="mt-1">{selectedLead.phone ?? "—"}</p>
              </div>
              {selectedLead.message && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Message
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{selectedLead.message}</p>
                </div>
              )}
              {selectedLead.metadata &&
                Object.keys(selectedLead.metadata as Record<string, unknown>).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Métadonnées
                    </p>
                    <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-muted/30 p-3 text-xs">
                      {JSON.stringify(selectedLead.metadata, null, 2)}
                    </pre>
                  </div>
                )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
