import { apiRequest } from "@/lib/api/client";
import type { RankedPlayerRow, RankingCategory } from "@/types/ranking.types";

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeItem(raw: unknown, index: number): RankedPlayerRow | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const valor = toNumber(
    r.valor ??
      r.total ??
      r.cantidad ??
      r.goles ??
      r.asistencias ??
      r.amarillas ??
      r.rojas ??
      r.value,
  );
  if (valor <= 0) return null;

  return {
    posicion: toNumber(r.posicion ?? r.position ?? r.rank, index + 1),
    jugadorId: String(r.jugadorId ?? r.playerId ?? r.id ?? index),
    jugadorNombre: String(
      r.jugadorNombre ?? r.nombre ?? r.playerName ?? r.name ?? "Jugador",
    ),
    equipoNombre: String(
      r.equipoNombre ?? r.equipo ?? r.teamName ?? "Sin equipo",
    ),
    dorsal:
      typeof r.dorsal === "number"
        ? r.dorsal
        : typeof r.jerseyNumber === "number"
          ? r.jerseyNumber
          : undefined,
    partidosJugados: toNumber(r.partidosJugados ?? r.pj ?? r.matchesPlayed),
    valor,
  };
}

export async function getFeaturedPlayersRanking(
  categoria: RankingCategory,
  limit = 10,
): Promise<RankedPlayerRow[]> {
  const res = await apiRequest<unknown>(
    `estadisticas/ranking?categoria=${encodeURIComponent(categoria)}&limit=${limit}`,
    { method: "GET" },
  );

  const list = Array.isArray(res)
    ? res
    : typeof res === "object" && res !== null
      ? (Array.isArray((res as Record<string, unknown>).items) &&
          ((res as Record<string, unknown>).items as unknown[])) ||
        (Array.isArray((res as Record<string, unknown>).ranking) &&
          ((res as Record<string, unknown>).ranking as unknown[])) ||
        (Array.isArray((res as Record<string, unknown>).data) &&
          ((res as Record<string, unknown>).data as unknown[])) ||
        []
      : [];

  return list
    .map((item, idx) => normalizeItem(item, idx))
    .filter((row): row is RankedPlayerRow => row !== null)
    .slice(0, limit);
}