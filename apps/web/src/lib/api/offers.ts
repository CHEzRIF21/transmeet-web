import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useOffers(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["offers"],
    queryFn: () =>
      apiRequest<unknown[]>("offers", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useOffersByRequest(
  requestId: string | undefined,
  accessToken: string | undefined
) {
  return useQuery({
    queryKey: ["offers", "by-request", requestId],
    queryFn: () =>
      apiRequest<unknown[]>(`offers/by-request?requestId=${requestId}`, {
        accessToken,
      }).then((r) => (r.success ? (r.data ?? []) : [])),
    enabled: !!requestId && !!accessToken,
  });
}

export function useCreateOffer(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiRequest("offers", {
        method: "POST",
        body: JSON.stringify(data),
        accessToken,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["transport-requests"] });
    },
  });
}

export function useAcceptOffer(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) =>
      apiRequest(`offers/${offerId}/accept`, {
        method: "POST",
        accessToken,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["transport-requests"] });
      qc.invalidateQueries({ queryKey: ["missions"] });
    },
  });
}
