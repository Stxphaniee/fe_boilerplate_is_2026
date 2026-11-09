
import { useQuery } from "@tanstack/react-query";
import { getMyTeam } from "@/services/teams.service";

export const teamKeys = {
  all: ["teams"] as const,
  mine: () => [...teamKeys.all, "mine"] as const,
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
