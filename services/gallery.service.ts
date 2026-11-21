import { apiRequest } from "@/lib/api/client";
import type { MatchGalleryPayload, MatchMediaItem } from "@/types/gallery.types";

export async function getPublicMatchGallery(
  matchId: string,
): Promise<MatchGalleryPayload> {
  const res = await apiRequest<
    | MatchMediaItem[]
    | (Partial<MatchGalleryPayload> & { items?: MatchMediaItem[]; media?: MatchMediaItem[] })
  >(`partidos/${matchId}/galeria`, { method: "GET" });

  if (Array.isArray(res)) {
    return { items: res };
  }

  const rawItems = Array.isArray(res?.items)
    ? res.items
    : Array.isArray(res?.media)
      ? res.media
      : [];

  return {
    partidoId: typeof res?.partidoId === "string" ? res.partidoId : matchId,
    estado: typeof res?.estado === "string" ? res.estado : "FINALIZADO",
    marcador: typeof res?.marcador === "string" ? res.marcador : undefined,
    jornada: res?.jornada,
    items: rawItems,
  };
}
