import { useQuery } from "@tanstack/react-query";
import { getPublicMatchGallery } from "@/services/gallery.service";

export const publicGalleryKeys = {
  all: ["public-gallery"] as const,
  match: (matchId: string) => [...publicGalleryKeys.all, matchId] as const,
};

export function usePublicMatchGalleryQuery(matchId: string) {
  return useQuery({
    queryKey: publicGalleryKeys.match(matchId),
    queryFn: () => getPublicMatchGallery(matchId),
    enabled: Boolean(matchId),
    retry: false,
  });
}
