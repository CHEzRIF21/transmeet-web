import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useVehicles(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () =>
      apiRequest<unknown[]>("vehicles", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useCompanies(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () =>
      apiRequest<unknown[]>("companies", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useCreateCompany(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("companies", {
        method: "POST",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companies"] }),
  });
}

export function useCreateVehicle(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("vehicles", {
        method: "POST",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

export function useUpdateVehicle(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Record<string, unknown>) =>
      apiRequest(`vehicles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}
