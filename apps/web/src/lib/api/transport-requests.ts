import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useTransportRequests(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["transport-requests"],
    queryFn: () =>
      apiRequest<unknown[]>("transport-requests", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useTransportRequest(
  id: string | undefined,
  accessToken: string | undefined
) {
  return useQuery({
    queryKey: ["transport-requests", id],
    queryFn: () =>
      apiRequest(`transport-requests/${id}`, { accessToken }).then((r) =>
        r.success ? r.data : null
      ),
    enabled: !!id && !!accessToken,
  });
}

export function useCreateTransportRequest(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("transport-requests", {
        method: "POST",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transport-requests"] }),
  });
}
