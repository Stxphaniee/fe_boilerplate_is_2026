export type MatchMediaType = "IMAGEN" | "VIDEO";

export interface MatchMediaItem {
  id: string;
  url: string;
  tipo: MatchMediaType;
  tamanoBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export interface UploadMatchMediaResponse {
  items?: MatchMediaItem[];
}

export interface MatchGalleryPayload {
  partidoId?: string;
  estado?: string;
  marcador?: string;
  jornada?: string | number;
  items: MatchMediaItem[];
}