import { useQuery } from "@tanstack/react-query";
import { getSeasonGeneralStats } from "@/services/season-stats.service";

export const seasonStatsKeys = {
  all: ["season-stats"] as const,
};

export function useSeasonGeneralStatsQuery(enabled: boolean) {
  return useQuery({
    queryKey: seasonStatsKeys.all,
    queryFn: getSeasonGeneralStats,
    enabled,
    retry: false,
  });
}
