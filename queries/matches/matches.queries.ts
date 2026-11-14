import { useQuery } from "@tanstack/react-query";

import {
  getRounds,
  getAvailableTeams,
  getReferees,
  getRoundMatches,
} from "@/services/matches.service";

export const matchKeys = {
  all: ["matches"] as const,

  rounds: () => [...matchKeys.all, "rounds"] as const,

  availableTeams: () =>
    [...matchKeys.all, "available-teams"] as const,

  referees: () =>
    [...matchKeys.all, "referees"] as const,

  roundMatches: (roundId: string) =>
    [...matchKeys.all, "round-matches", roundId] as const,
};

/**
 * Consulta jornadas.
 */
export function useRoundsQuery(enabled = true) {
  return useQuery({
    queryKey: matchKeys.rounds(),
    queryFn: getRounds,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}

/**
 * Consulta equipos disponibles.
 */
export function useAvailableTeamsQuery(enabled = true) {
  return useQuery({
    queryKey: matchKeys.availableTeams(),
    queryFn: getAvailableTeams,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}

/**
 * Consulta árbitros.
 */
export function useRefereesQuery(enabled = true) {
  return useQuery({
    queryKey: matchKeys.referees(),
    queryFn: getReferees,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}

/**
 * Consulta partidos por jornada.
 */
export function useRoundMatchesQuery(
  roundId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: matchKeys.roundMatches(roundId),
    queryFn: () => getRoundMatches(roundId),
    enabled: enabled && !!roundId,
    retry: false,
    staleTime: 30_000,
  });
}