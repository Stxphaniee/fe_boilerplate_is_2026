import { apiRequest } from "@/lib/api/client";
import type { PlayerIndividualStats } from "@/types/player-stats.types";

function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function getMyPlayerStats(): Promise<PlayerIndividualStats> {
  const res = await apiRequest<unknown>("jugadores/mis-estadisticas", {
    method: "GET",
  });

  const root =
    typeof res === "object" && res !== null
      ? (res as Record<string, unknown>)
      : {};
  const src =
    typeof root.data === "object" && root.data !== null
      ? (root.data as Record<string, unknown>)
      : root;

  return {
    jugadorNombre:
      typeof src.jugadorNombre === "string"
        ? src.jugadorNombre
        : typeof src.nombre === "string"
          ? src.nombre
          : typeof src.playerName === "string"
            ? src.playerName
            : undefined,
    equipoNombre:
      typeof src.equipoNombre === "string"
        ? src.equipoNombre
        : typeof src.equipo === "string"
          ? src.equipo
          : typeof src.teamName === "string"
            ? src.teamName
            : undefined,
    posicion:
      typeof src.posicion === "string"
        ? src.posicion
        : typeof src.position === "string"
          ? src.position
          : undefined,
    dorsal:
      typeof src.dorsal === "number"
        ? src.dorsal
        : typeof src.jerseyNumber === "number"
          ? src.jerseyNumber
          : undefined,
    temporada:
      typeof src.temporada === "string"
        ? src.temporada
        : typeof src.seasonName === "string"
          ? src.seasonName
          : undefined,
    partidosJugados: toNumber(
      src.partidosJugados ?? src.pj ?? src.matchesPlayed,
    ),
    goles: toNumber(src.goles ?? src.goals),
    asistencias: toNumber(src.asistencias ?? src.assists),
    tarjetasAmarillas: toNumber(
      src.tarjetasAmarillas ?? src.amarillas ?? src.yellowCards,
    ),
    tarjetasRojas: toNumber(src.tarjetasRojas ?? src.rojas ?? src.redCards),
  };
}