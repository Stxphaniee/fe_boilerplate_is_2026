"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/errors";

import {
  getRefereeMatches,
  getRefereePanel,
} from "@/services/referee.service";

export const REFEREE_REFRESH_INTERVAL = 5_000;

export const refereeKeys = {
  all: ["referee"] as const,

  matches: (userId: string) =>
    [...refereeKeys.all, userId, "matches"] as const,

  panel: (userId: string, matchId: string) =>
    [
      ...refereeKeys.all,
      userId,
      "panel",
      matchId,
    ] as const,
};

function getRefreshInterval(
  error: unknown,
): number | false {
  if (
    error instanceof ApiError &&
    [401, 403, 404].includes(error.status)
  ) {
    return false;
  }

  return REFEREE_REFRESH_INTERVAL;
}

// =====================================================
// PARTIDOS ASIGNADOS
// =====================================================

export function useRefereeMatchesQuery(
  userId: string,
) {
  return useQuery({
    queryKey: refereeKeys.matches(userId),

    queryFn: ({ signal }) =>
      getRefereeMatches(signal),

    enabled: Boolean(userId),

    staleTime: 0,
    retry: false,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,

    refetchInterval: (query) =>
      getRefreshInterval(query.state.error),
  });
}

// =====================================================
// PANEL EN VIVO
// =====================================================

export function useRefereePanelQuery(
  userId: string,
  matchId: string,
) {
  return useQuery({
    queryKey: refereeKeys.panel(userId, matchId),

    queryFn: ({ signal }) =>
      getRefereePanel(matchId, signal),

    enabled: Boolean(userId && matchId),

    staleTime: 0,
    retry: false,

    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false,

    refetchInterval: (query) => {
      const interval = getRefreshInterval(
        query.state.error,
      );

      if (interval === false) return false;

      const estado = query.state.data?.estado;

      if (
        estado === "FINALIZADO" ||
        estado === "CANCELADO"
      ) {
        return false;
      }

      return interval;
    },
  });
}