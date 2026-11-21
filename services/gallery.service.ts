import { apiRequest } from "@/lib/api/client";
import type { MatchMediaItem, UploadMatchMediaResponse } from "@/types/gallery.types";

const MAX_FILES_PER_MATCH = 20;
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "video/mp4",
]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".mp4"]);

export function validateGalleryFiles(
  files: File[],
  existingCount: number,
): string | null {
  if (files.length === 0) {
    return "Selecciona al menos un archivo JPG, PNG o MP4.";
  }

  if (existingCount + files.length > MAX_FILES_PER_MATCH) {
    const available = Math.max(0, MAX_FILES_PER_MATCH - existingCount);
    return `Solo puedes subir hasta ${available} archivo(s) más (máximo ${MAX_FILES_PER_MATCH} por partido).`;
  }

  for (const file of files) {
    const lowerName = file.name.toLowerCase();
    const dotIndex = lowerName.lastIndexOf(".");
    const ext = dotIndex >= 0 ? lowerName.slice(dotIndex) : "";
    const validMime = ALLOWED_MIME_TYPES.has(file.type.toLowerCase());
    const validExt = ALLOWED_EXTENSIONS.has(ext);

    if (!validMime || !validExt) {
      return `Archivo no permitido (${file.name}). Solo se aceptan JPG, PNG y MP4.`;
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return `El archivo ${file.name} supera el límite de 50 MB.`;
    }
  }

  return null;
}

export async function getMatchGallery(matchId: string): Promise<MatchMediaItem[]> {
  const res = await apiRequest<MatchMediaItem[] | { items?: MatchMediaItem[] }>(
    `partidos/${matchId}/galeria`,
    { method: "GET" },
  );
  if (Array.isArray(res)) return res;
  return Array.isArray(res?.items) ? res.items : [];
}

export async function uploadMatchMedia(
  matchId: string,
  files: File[],
  onProgress?: (percent: number) => void,
): Promise<MatchMediaItem[]> {
  onProgress?.(25);

  const formData = new FormData();
  for (const file of files) {
    formData.append("archivos", file);
    formData.append("files", file);
  }

  onProgress?.(65);

  const response = await fetch(`/api/partidos/${matchId}/galeria`, {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const msg =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `No se pudieron subir los archivos (${response.status}).`;
    throw new Error(msg);
  }

  onProgress?.(100);

  if (Array.isArray(payload)) {
    return payload as MatchMediaItem[];
  }
  const typed = payload as UploadMatchMediaResponse | undefined;
  return Array.isArray(typed?.items) ? typed.items : [];
}
