export type MediaType = "IMAGEN" | "VIDEO";

export interface MatchMediaItem {
  id: string;
  partidoId: string;
  url: string;
  tipo: MediaType;
  tamanoBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface MatchGalleryPayload {
  partidoId?: string;
  estado?: string;
  marcador?: string;
  jornada?: string | number;
  items: MatchMediaItem[];
}
