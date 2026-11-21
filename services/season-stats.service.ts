import { apiRequest } from "@/lib/api/client";
import type { SeasonGeneralStats } from "@/types/season-stats.types";

const EMPTY_STATS: SeasonGeneralStats = {
  golesTotales: 0,
  amarillasTotales: 0,
  rojasTotales: 0,
  partidosFinalizados: 0,
};

export async function getSeasonGeneralStats(): Promise<SeasonGeneralStats> {
  const res = await apiRequest<unknown>("admin/reportes/general", {
    method: "GET",
  });
  if (typeof res !== "object" || res === null) {
    return { ...EMPTY_STATS };
  }
  const obj = res as Record<string, unknown>;
  const source =
    typeof obj.data === "object" && obj.data !== null
      ? (obj.data as Record<string, unknown>)
      : obj;

  return {
    golesTotales: typeof source.golesTotales === "number" ? source.golesTotales : 0,
    amarillasTotales:
      typeof source.amarillasTotales === "number" ? source.amarillasTotales : 0,
    rojasTotales: typeof source.rojasTotales === "number" ? source.rojasTotales : 0,
    partidosFinalizados:
      typeof source.partidosFinalizados === "number"
        ? source.partidosFinalizados
        : 0,
  };
}
