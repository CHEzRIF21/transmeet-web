import { useQuery } from "@tanstack/react-query";
import {
  getExpediteurStats,
  getExpediteurRecentMissions,
  getTransporteurStats,
  getTransporteurRecentMissions,
  getAdminStats,
  getAdminRecentMissions,
} from "@/app/actions/dashboard";

export function useExpediteurStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "expediteur", "stats", userId],
    queryFn: () => (userId ? getExpediteurStats(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });
}

export function useExpediteurMissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "expediteur", "missions", userId],
    queryFn: () =>
      userId ? getExpediteurRecentMissions(userId, 5) : Promise.resolve([]),
    enabled: !!userId,
  });
}

export function useTransporteurStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "transporteur", "stats", userId],
    queryFn: () => (userId ? getTransporteurStats(userId) : Promise.resolve(null)),
    enabled: !!userId,
  });
}

export function useTransporteurMissions(userId: string | undefined) {
  return useQuery({
    queryKey: ["dashboard", "transporteur", "missions", userId],
    queryFn: () =>
      userId ? getTransporteurRecentMissions(userId, 5) : Promise.resolve([]),
    enabled: !!userId,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["dashboard", "admin", "stats"],
    queryFn: getAdminStats,
  });
}

export function useAdminMissions() {
  return useQuery({
    queryKey: ["dashboard", "admin", "missions"],
    queryFn: () => getAdminRecentMissions(5),
  });
}
