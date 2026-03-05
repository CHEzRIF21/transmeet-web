"use client";

import { useState, useMemo } from "react";
import {
  Search,
  User,
  MoreHorizontal,
  Ban,
  Trash2,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type UserRole = "expediteur" | "transporteur";
type UserStatus = "actif" | "suspendu";

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  inscritLe: string;
  status: UserStatus;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    name: "Jean Kouassi",
    email: "jean.kouassi@mail.com",
    role: "expediteur",
    inscritLe: "15 janv. 2025",
    status: "actif",
  },
  {
    id: "2",
    name: "Marie Adjo",
    email: "marie.adjo@mail.com",
    role: "transporteur",
    inscritLe: "12 janv. 2025",
    status: "actif",
  },
  {
    id: "3",
    name: "Kofi Mensah",
    email: "kofi.mensah@mail.com",
    role: "expediteur",
    inscritLe: "10 janv. 2025",
    status: "suspendu",
  },
  {
    id: "4",
    name: "Amina Ouedraogo",
    email: "amina.o@mail.com",
    role: "transporteur",
    inscritLe: "8 janv. 2025",
    status: "actif",
  },
  {
    id: "5",
    name: "Paul Dossou",
    email: "paul.dossou@mail.com",
    role: "expediteur",
    inscritLe: "5 janv. 2025",
    status: "actif",
  },
  {
    id: "6",
    name: "Fatou Diallo",
    email: "fatou.diallo@mail.com",
    role: "transporteur",
    inscritLe: "3 janv. 2025",
    status: "actif",
  },
  {
    id: "7",
    name: "Ibrahim Traoré",
    email: "ibrahim.t@mail.com",
    role: "expediteur",
    inscritLe: "28 déc. 2024",
    status: "suspendu",
  },
  {
    id: "8",
    name: "Sophie Adjani",
    email: "sophie.adj@mail.com",
    role: "transporteur",
    inscritLe: "25 déc. 2024",
    status: "actif",
  },
  {
    id: "9",
    name: "Oumar Camara",
    email: "oumar.camara@mail.com",
    role: "expediteur",
    inscritLe: "20 déc. 2024",
    status: "actif",
  },
  {
    id: "10",
    name: "Adèle Yao",
    email: "adele.yao@mail.com",
    role: "transporteur",
    inscritLe: "15 déc. 2024",
    status: "actif",
  },
];

const ROLE_OPTIONS: { key: UserRole | "tous"; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "expediteur", label: "Expéditeur" },
  { key: "transporteur", label: "Transporteur" },
];

const STATUS_OPTIONS: { key: UserStatus | "tous"; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "actif", label: "Actif" },
  { key: "suspendu", label: "Suspendu" },
];

export function UtilisateursContent() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "tous">("tous");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "tous">("tous");

  const filteredUsers = useMemo(() => {
    let list = [...MOCK_USERS];
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (roleFilter !== "tous") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter !== "tous")
      list = list.filter((u) => u.status === statusFilter);
    return list;
  }, [search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold tracking-tight"
        style={{ color: NAVY }}
      >
        Utilisateurs
      </h1>

      {/* Search + filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRoleFilter(opt.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                roleFilter === opt.key ? "text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
              style={roleFilter === opt.key ? { backgroundColor: NAVY } : undefined}
            >
              {opt.label}
            </button>
          ))}
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

      {/* Table */}
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
                  Nom
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Rôle
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Date inscription
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
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={u.role === "expediteur" ? "info" : "accent"}
                      className="capitalize"
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.inscritLe}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        u.status === "actif"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      )}
                    >
                      {u.status === "actif" ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[180px]">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-3.5 w-3.5" />
                          Voir profil
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-orange-600">
                          <Ban className="h-3.5 w-3.5" />
                          Suspendre
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          className="gap-2 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <User
              className="h-12 w-12 text-muted-foreground mb-4"
              style={{ color: `${NAVY}40` }}
            />
            <p className="text-muted-foreground">
              Aucun utilisateur trouvé.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
