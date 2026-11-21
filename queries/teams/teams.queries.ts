import { useQuery } from "@tanstack/react-query";
import { getMyTeam, getTeamPlayers } from "@/services/teams.service";

export const teamKeys = {
  all: ["teams"] as const,
  mine: () => [...teamKeys.all, "mine"] as const,
  players: (teamId: string) =>
    [...teamKeys.all, teamId, "players"] as const,
};

export function useMyTeamQuery(enabled = true) {
  return useQuery({
    queryKey: teamKeys.mine(),
    queryFn: getMyTeam,
    enabled,
    retry: false,
    staleTime: 30_000,
  });
}

export function useTeamPlayersQuery(teamId: string, enabled = true) {
  return useQuery({
    queryKey: teamKeys.players(teamId),
    queryFn: () => getTeamPlayers(teamId),
    enabled: enabled && !!teamId,
    retry: false,
    staleTime: 30_000,
  });
}