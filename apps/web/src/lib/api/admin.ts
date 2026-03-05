import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

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
