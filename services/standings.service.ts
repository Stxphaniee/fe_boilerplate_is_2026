import { apiRequest } from "@/lib/api/client";
import type { StandingRow, StandingsResponse } from "@/types/standings.types";

const HIDDEN_STATES = new Set([
  "PENDIENTE_VALIDACION",
  "RECHAZADO",
  "SUSPENDIDO",
]);

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeRow(raw: unknown, index: number): StandingRow | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const rawState = String(r.estado ?? r.status ?? "").toUpperCase();
  if (rawState && HIDDEN_STATES.has(rawState)) {
    return null;
  }

  const gf = toNumber(r.gf ?? r.golesFavor ?? r.goalsFor);
  const gc = toNumber(r.gc ?? r.golesContra ?? r.goalsAgainst);
  const dg =
    typeof r.dg === "number"
      ? r.dg
      : typeof r.diferenciaGoles === "number"
        ? r.diferenciaGoles
        : typeof r.goalDifference === "number"
          ? r.goalDifference
          : gf - gc;

  return {
    posicion: toNumber(r.posicion ?? r.position, index + 1),
    equipoId: String(r.equipoId ?? r.teamId ?? r.id ?? index),
    equipo: String(r.equipo ?? r.nombreEquipo ?? r.teamName ?? r.name ?? "Equipo"),
    pj: toNumber(r.pj ?? r.partidosJugados ?? r.played),
    pg: toNumber(r.pg ?? r.ganados ?? r.won),
    pe: toNumber(r.pe ?? r.empatados ?? r.drawn),
    pp: toNumber(r.pp ?? r.perdidos ?? r.lost),
    gf,
    gc,
    dg,
    pts: toNumber(r.pts ?? r.puntos ?? r.points),
    estado: rawState || undefined,
    esMiEquipo: Boolean(r.esMiEquipo ?? r.isMyTeam ?? false),
  };
}

export async function getStandings(): Promise<StandingsResponse> {
  const res = await apiRequest<unknown>("tabla-posiciones", { method: "GET" });

  if (Array.isArray(res)) {
    const rows = res
      .map((item, idx) => normalizeRow(item, idx))
      .filter((row): row is StandingRow => row !== null);
    return { tabla: rows };
  }

  if (typeof res === "object" && res !== null) {
    const obj = res as Record<string, unknown>;
    const rawList =
      (Array.isArray(obj.tabla) && obj.tabla) ||
      (Array.isArray(obj.posiciones) && obj.posiciones) ||
      (Array.isArray(obj.items) && obj.items) ||
      (Array.isArray(obj.data) && obj.data) ||
      [];

    const rows = rawList
      .map((item, idx) => normalizeRow(item, idx))
      .filter((row): row is StandingRow => row !== null);

    return {
      temporada:
        typeof obj.temporada === "string"
          ? obj.temporada
          : typeof obj.seasonName === "string"
            ? obj.seasonName
            : undefined,
      actualizadoEn:
        typeof obj.actualizadoEn === "string"
          ? obj.actualizadoEn
          : typeof obj.updatedAt === "string"
            ? obj.updatedAt
            : undefined,
      tabla: rows,
    };
  }

  return { tabla: [] };
}
