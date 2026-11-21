import { useQuery } from "@tanstack/react-query";
import { getStandings } from "@/services/standings.service";

export const standingsKeys = {
  all: ["standings"] as const,
};

export function useStandingsQuery() {
  return useQuery({
    queryKey: standingsKeys.all,
    queryFn: getStandings,
    retry: 1,
  });
}
