import { useQuery } from "@tanstack/react-query";
import { getFeaturedPlayersRanking } from "@/services/ranking.service";
import type { RankingCategory } from "@/types/ranking.types";

export const rankingKeys = {
  all: ["stats-ranking"] as const,
  byCategory: (categoria: RankingCategory) =>
    [...rankingKeys.all, categoria] as const,
};

export function useFeaturedPlayersRankingQuery(
  categoria: RankingCategory,
  enabled: boolean,
) {
  return useQuery({
    queryKey: rankingKeys.byCategory(categoria),
    queryFn: () => getFeaturedPlayersRanking(categoria, 10),
    enabled,
    retry: false,
  });
}