import { useQuery } from "@tanstack/react-query";
import { getMyPlayerStats } from "@/services/player-stats.service";

export const playerStatsKeys = {
  mine: ["player-stats", "mine"] as const,
};

export function useMyPlayerStatsQuery(enabled: boolean) {
  return useQuery({
    queryKey: playerStatsKeys.mine,
    queryFn: getMyPlayerStats,
    enabled,
    retry: false,
  });
}