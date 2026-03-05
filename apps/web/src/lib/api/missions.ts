import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useMissions(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["missions"],
    queryFn: () =>
      apiRequest<unknown[]>("missions", { accessToken }).then((r) =>
        r.success ? (r.data ?? []) : []
      ),
    enabled: !!accessToken,
  });
}

export function useMission(
  id: string | undefined,
  accessToken: string | undefined
) {
  return useQuery({
    queryKey: ["missions", id],
    queryFn: () =>
      apiRequest(`missions/${id}`, { accessToken }).then((r) =>
        r.success ? r.data : null
      ),
    enabled: !!id && !!accessToken,
  });
}

export function useMissionStatusUpdate(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      missionId,
      status,
    }: {
      missionId: string;
      status: string;
    }) =>
      apiRequest(`missions/${missionId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        accessToken,
      }),
    onSuccess: (_, v) =>
      qc.invalidateQueries({ queryKey: ["missions", v.missionId] }),
  });
}

export function useMissionReview(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      missionId,
      rating,
      comment,
    }: {
      missionId: string;
      rating: number;
      comment?: string;
    }) =>
      apiRequest(`missions/${missionId}/review`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
        accessToken,
      }),
    onSuccess: (_, v) =>
      qc.invalidateQueries({ queryKey: ["missions", v.missionId] }),
  });
}

export function useMissionTracking(
  missionId: string | undefined,
  accessToken: string | undefined
) {
  return useQuery({
    queryKey: ["missions", missionId, "tracking"],
    queryFn: () =>
      apiRequest<unknown[]>(`missions/${missionId}/tracking`, {
        accessToken,
      }).then((r) => (r.success ? (r.data ?? []) : [])),
    enabled: !!missionId && !!accessToken,
  });
}

export function useSendTrackingPosition(accessToken: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      missionId,
      latitude,
      longitude,
      speedKmh,
      locality,
    }: {
      missionId: string;
      latitude: number;
      longitude: number;
      speedKmh?: number;
      locality?: string;
    }) =>
      apiRequest(`missions/${missionId}/tracking`, {
        method: "POST",
        body: JSON.stringify({
          latitude,
          longitude,
          speedKmh,
          locality,
        }),
        accessToken,
      }),
    onSuccess: (_, v) =>
      qc.invalidateQueries({
        queryKey: ["missions", v.missionId, "tracking"],
      }),
  });
}
