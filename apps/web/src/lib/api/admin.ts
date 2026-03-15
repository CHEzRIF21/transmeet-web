import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Lead } from "@transmit/types";
import { apiRequest } from "./client";

export interface AdminLeadsParams {
  type?: "ALL" | "EXPEDITEUR" | "TRANSPORTEUR" | "BTP" | "CONTACT";
  search?: string;
  page?: number;
}

export interface AdminLeadsResponse {
  data: Lead[];
  total: number;
  page: number;
}

async function fetchAdminLeads(
  params: AdminLeadsParams,
  accessToken: string
): Promise<AdminLeadsResponse> {
  const searchParams = new URLSearchParams();
  if (params.type && params.type !== "ALL") searchParams.set("type", params.type);
  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.page) searchParams.set("page", String(params.page));
  const query = searchParams.toString();
  const path = `admin/leads${query ? `?${query}` : ""}`;
  const res = (await apiRequest(path, { accessToken })) as {
    success: boolean;
    data?: Lead[];
    total?: number;
    page?: number;
  };
  if (!res.success) {
    return { data: [], total: 0, page: 1 };
  }
  return { data: res.data ?? [], total: res.total ?? 0, page: res.page ?? 1 };
}

export function useAdminLeads(
  accessToken: string | undefined,
  params: AdminLeadsParams = {}
) {
  return useQuery({
    queryKey: ["admin", "leads", params],
    queryFn: () => fetchAdminLeads(params, accessToken!),
    enabled: !!accessToken,
  });
}

export function useAdminUsers(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () =>
      apiRequest<unknown[]>("admin/users", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useAdminKyc(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["admin", "kyc"],
    queryFn: () =>
      apiRequest<unknown[]>("admin/kyc", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useAdminSettings(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () =>
      apiRequest<Record<string, unknown>>("admin/settings", { accessToken }).then(
        (r) => (r.success ? (r.data ?? {}) : {})
      ),
    enabled: !!accessToken,
  });
}

export function useAdminStats(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () =>
      apiRequest<Record<string, unknown>>("admin/stats", { accessToken }).then(
        (r) => (r.success ? r.data : null)
      ),
    enabled: !!accessToken,
  });
}

export function useUpdateUserStatus(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      is_active,
    }: { userId: string; is_active: boolean }) =>
      apiRequest(`admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active }),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

export function useReviewKyc(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      docId,
      statut,
      rejectionNote,
    }: {
      docId: string;
      statut: "APPROVED" | "REJECTED";
      rejectionNote?: string;
    }) =>
      apiRequest(`admin/kyc/${docId}`, {
        method: "PATCH",
        body: JSON.stringify({ statut, rejectionNote }),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "kyc"] }),
  });
}

export function useUpdateSetting(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      apiRequest("admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ key, value }),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
}
