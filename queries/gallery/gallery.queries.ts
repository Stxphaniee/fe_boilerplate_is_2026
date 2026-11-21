import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMatchGallery,
  getPublicMatchGallery,
  uploadMatchMedia,
} from "@/services/gallery.service";

export const galleryKeys = {
  all: ["gallery"] as const,
  match: (matchId: string) => [...galleryKeys.all, matchId] as const,
};

export function useMatchGalleryQuery(matchId: string) {
  return useQuery({
    queryKey: galleryKeys.match(matchId),
    queryFn: () => getMatchGallery(matchId),
    enabled: Boolean(matchId),
    retry: false,
  });
}

export function useUploadMatchMediaMutation(
  matchId: string,
  onProgress?: (percent: number) => void,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => uploadMatchMedia(matchId, files, onProgress),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: galleryKeys.match(matchId) });
    },
  });
}

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