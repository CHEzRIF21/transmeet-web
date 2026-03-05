"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Download,
  FileDown,
  Wallet,
  Receipt,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatXOF } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/database.types";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type TransactionStatus = "paye" | "en_attente" | "echoue";
type PaymentMethod = "mobile_money" | "virement" | "especes";
type PeriodFilter = "mois" | "3mois" | "6mois" | "tout";

interface MockTransaction {
  id: string;
  missionRef: string;
  date: string;
  amountCfa: number;
  method: PaymentMethod;
  methodLabel: string;
  status: TransactionStatus;
}

const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: "TXN-2024-001",
    missionRef: "MSN-2024-001",
    date: "15 mars 2025",
    amountCfa: 450000,
    method: "mobile_money",
    methodLabel: "MTN Mobile Money",
    status: "paye",
  },
  {
    id: "TXN-2024-002",
    missionRef: "MSN-2024-002",
    date: "14 mars 2025",
    amountCfa: 780000,
    method: "mobile_money",
    methodLabel: "Moov Money",
    status: "en_attente",
  },
  {
    id: "TXN-2024-003",
    missionRef: "MSN-2024-003",
    date: "12 mars 2025",
    amountCfa: 620000,
    method: "virement",
    methodLabel: "Virement bancaire",
    status: "paye",
  },
  {
    id: "TXN-2024-004",
    missionRef: "MSN-2024-004",
    date: "10 mars 2025",
    amountCfa: 520000,
    method: "mobile_money",
    methodLabel: "Wave",
    status: "echoue",
  },
  {
    id: "TXN-2024-005",
    missionRef: "MSN-2024-005",
    date: "5 mars 2025",
    amountCfa: 350000,
    method: "especes",
    methodLabel: "Espèces",
    status: "paye",
  },
  {
    id: "TXN-2024-006",
    missionRef: "MSN-2024-006",
    date: "28 févr. 2025",
    amountCfa: 890000,
    method: "virement",
    methodLabel: "Virement bancaire",
    status: "paye",
  },
  {
    id: "TXN-2024-007",
    missionRef: "MSN-2024-007",
    date: "25 févr. 2025",
    amountCfa: 410000,
    method: "mobile_money",
    methodLabel: "Orange Money",
    status: "en_attente",
  },
  {
    id: "TXN-2024-008",
    missionRef: "MSN-2024-008",
    date: "20 févr. 2025",
    amountCfa: 670000,
    method: "mobile_money",
    methodLabel: "MTN Mobile Money",
    status: "paye",
  },
  {
    id: "TXN-2024-009",
    missionRef: "MSN-2024-009",
    date: "15 févr. 2025",
    amountCfa: 290000,
    method: "especes",
    methodLabel: "Espèces",
    status: "paye",
  },
  {
    id: "TXN-2024-010",
    missionRef: "MSN-2024-010",
    date: "10 févr. 2025",
    amountCfa: 540000,
    method: "virement",
    methodLabel: "Virement bancaire",
    status: "echoue",
  },
];

const STATUS_CONFIG: Record<
  TransactionStatus,
  { label: string; className: string }
> = {
  paye: {
    label: "Payé",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  en_attente: {
    label: "En attente",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  echoue: {
    label: "Échoué",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const PERIOD_OPTIONS: { key: PeriodFilter; label: string }[] = [
  { key: "mois", label: "Ce mois" },
  { key: "3mois", label: "3 mois" },
  { key: "6mois", label: "6 mois" },
  { key: "tout", label: "Tout" },
];

const STATUS_OPTIONS: { key: TransactionStatus | "tous"; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "paye", label: "Payé" },
  { key: "en_attente", label: "En attente" },
  { key: "echoue", label: "Échoué" },
];

function getStatusReceiptStyle(status: TransactionStatus) {
  switch (status) {
    case "paye":
      return "background: #dcfce7; color: #166534;";
    case "en_attente":
      return "background: #ffedd5; color: #c2410c;";
    default:
      return "background: #fee2e2; color: #b91c1c;";
  }
}

function generateReceipt(transaction: MockTransaction) {
  const statusCfg = STATUS_CONFIG[transaction.status];
  const statusStyle = getStatusReceiptStyle(transaction.status);
  const receiptHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reçu - ${transaction.id}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; max-width: 400px; margin: 0 auto; }
    h1 { color: #1B2B5E; font-size: 1.25rem; margin-bottom: 8px; }
    .logo { font-weight: 700; color: #F5A623; margin-bottom: 24px; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
    .label { color: #64748b; }
    .amount { font-weight: 700; font-size: 1.25rem; color: #1B2B5E; margin: 16px 0; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="logo">TRANSMEET</div>
  <h1>Reçu de transaction</h1>
  <div class="row"><span class="label">Référence</span><span>${transaction.id}</span></div>
  <div class="row"><span class="label">Mission</span><span>#${transaction.missionRef}</span></div>
  <div class="row"><span class="label">Date</span><span>${transaction.date}</span></div>
  <div class="row"><span class="label">Méthode</span><span>${transaction.methodLabel}</span></div>
  <div class="amount">${formatXOF(transaction.amountCfa)}</div>
  <div class="row"><span class="label">Statut</span><span class="status" style="${statusStyle}">${statusCfg.label}</span></div>
  <div class="footer">Document généré le ${new Date().toLocaleDateString("fr-FR")} — Transmeet</div>
</body>
</html>`;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(receiptHtml);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 250);
  }
}

function exportToCsv(transactions: MockTransaction[]) {
  const headers = [
    "ID",
    "Mission",
    "Date",
    "Montant (FCFA)",
    "Méthode",
    "Statut",
  ];
  const rows = transactions.map((t) => {
    const statusCfg = STATUS_CONFIG[t.status];
    return [
      t.id,
      t.missionRef,
      t.date,
      t.amountCfa,
      t.methodLabel,
      statusCfg.label,
    ].join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-transmeet-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface PaiementsContentProps {
  role: AppRole;
}

export function PaiementsContent({ role }: PaiementsContentProps) {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("mois");
  const [statusFilter, setStatusFilter] = useState<
    TransactionStatus | "tous"
  >("tous");

  const filteredTransactions = useMemo(() => {
    let list = [...MOCK_TRANSACTIONS];
    if (statusFilter !== "tous") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (periodFilter !== "tout") {
      const cutoffDate = new Date();
      const cutoff =
        periodFilter === "mois"
          ? new Date(cutoffDate.getFullYear(), cutoffDate.getMonth(), 1)
          : periodFilter === "3mois"
            ? new Date(cutoffDate.getFullYear(), cutoffDate.getMonth() - 3, 1)
            : new Date(cutoffDate.getFullYear(), cutoffDate.getMonth() - 6, 1);
      list = list.filter((t) => {
        const parts = t.date.split(" ");
        const day = parseInt(parts[0], 10);
        const monthStr = (parts[1] ?? "").replace(".", "");
        const year = parseInt(parts[2] ?? "2025", 10);
        const months: Record<string, number> = {
          janv: 0, févr: 1, mars: 2, avr: 3, mai: 4, juin: 5,
          juil: 6, août: 7, sept: 8, oct: 9, nov: 10, déc: 11,
        };
        const d = new Date(year, months[monthStr] ?? 0, day);
        return d >= cutoff;
      });
    }
    return list;
  }, [periodFilter, statusFilter]);

  const summary = useMemo(() => {
    const thisMonth = MOCK_TRANSACTIONS.filter((t) => {
      const d = t.date;
      return d.includes("mars 2025");
    });
    const totalThisMonth = thisMonth
      .filter((t) => t.status === "paye")
      .reduce((s, t) => s + t.amountCfa, 0);
    const pending =
      role === "expediteur"
        ? thisMonth.filter((t) => t.status === "en_attente").length
        : thisMonth.filter((t) => t.status === "en_attente").reduce((s, t) => s + t.amountCfa, 0);
    return {
      totalThisMonth,
      pending:
        role === "expediteur"
          ? (pending as number)
          : formatXOF(pending as number),
    };
  }, [role]);

  const isExpediteur = role === "expediteur";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: NAVY }}
        >
          Paiements
        </h1>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          style={{ borderColor: NAVY, color: NAVY }}
          onClick={() => exportToCsv(filteredTransactions)}
        >
          <FileDown className="h-4 w-4" />
          Exporter en CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card
          className="transition-all"
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isExpediteur
                    ? "Total dépensé ce mois"
                    : "Revenus ce mois"}
                </p>
                <p
                  className="mt-1 text-xl font-bold"
                  style={{ color: NAVY }}
                >
                  {formatXOF(summary.totalThisMonth)}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${NAVY}12` }}
              >
                <Wallet className="h-5 w-5" style={{ color: NAVY }} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="transition-all"
          style={{
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
          }}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isExpediteur
                    ? "Factures en attente"
                    : "Paiements en attente"}
                </p>
                <p
                  className="mt-1 text-xl font-bold"
                  style={{ color: NAVY }}
                >
                  {isExpediteur
                    ? (summary.pending as number) === 0
                      ? "Aucune"
                      : `${summary.pending} facture${(summary.pending as number) > 1 ? "s" : ""}`
                    : summary.pending}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${GOLD}25` }}
              >
                <CreditCard className="h-5 w-5" style={{ color: GOLD }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPeriodFilter(opt.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                periodFilter === opt.key ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              style={periodFilter === opt.key ? { backgroundColor: NAVY } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setStatusFilter(opt.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                statusFilter === opt.key ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              style={statusFilter === opt.key ? { backgroundColor: NAVY } : undefined}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table (desktop) */}
      <Card
        className="hidden overflow-hidden md:block"
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
                  ID
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Mission
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Montant
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Méthode
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Statut
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((txn) => {
                const statusCfg = STATUS_CONFIG[txn.status];
                return (
                  <tr
                    key={txn.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium">
                      {txn.id}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: NAVY }}>
                      #{txn.missionRef}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: NAVY }}>
                      {formatXOF(txn.amountCfa)}
                    </td>
                    <td className="px-4 py-3">{txn.methodLabel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                          statusCfg.className
                        )}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => generateReceipt(txn)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Télécharger reçu
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cards (mobile) */}
      <div className="flex flex-col gap-4 md:hidden">
        {filteredTransactions.map((txn) => {
          const statusCfg = STATUS_CONFIG[txn.status];
          return (
            <Card
              key={txn.id}
              className="overflow-hidden"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(27,43,94,0.08)",
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs font-medium text-muted-foreground">
                      {txn.id}
                    </p>
                    <p
                      className="font-mono text-sm font-bold"
                      style={{ color: NAVY }}
                    >
                      #{txn.missionRef}
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
                <p className="mt-2 text-sm text-muted-foreground">{txn.date}</p>
                <p
                  className="mt-1 text-lg font-bold"
                  style={{ color: NAVY }}
                >
                  {formatXOF(txn.amountCfa)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {txn.methodLabel}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full gap-1"
                  style={{ borderColor: NAVY }}
                  onClick={() => generateReceipt(txn)}
                >
                  <Receipt className="h-3.5 w-3.5" />
                  Télécharger reçu
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <Card
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
          style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(27,43,94,0.08)" }}
        >
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: `${NAVY}12` }}
          >
            <CreditCard className="h-12 w-12" style={{ color: NAVY }} />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: NAVY }}>
            Aucune transaction
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Aucune transaction ne correspond à ces filtres.
          </p>
        </Card>
      )}
    </div>
  );
}
