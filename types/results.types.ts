
import type {
  CourtOption,
  MatchState,
} from "@/types/matches.types";

import type {
  MatchEventType,
} from "@/types/referee.types";

// =====================================================
// EQUIPOS Y MARCADOR
// =====================================================

export interface ResultTeam {
  id: string;
  nombre: string;
  goles: number | null;
}

// =====================================================
// LISTADO PUBLICO DE PARTIDOS
// =====================================================

export interface ResultMatch {
  id: string;
  jornada: number;
  estado: MatchState;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  cancha: CourtOption;
  equipoLocal: ResultTeam;
  equipoVisitante: ResultTeam;
}

// =====================================================
// EVENTOS DEL ENCUENTRO
// =====================================================

export interface ResultEvent {
  id: string;
  jugadorId: string;
  jugador: string;
  equipoId: string;
  tipo: MatchEventType;
  minuto: number;
  golRelacionadoId: string | null;
  createdAt: string;
}

// =====================================================
// DETALLE PUBLICO
// =====================================================

export interface ResultMatchDetail extends ResultMatch {
  eventos: ResultEvent[];
  galeriaDisponible: boolean;
}

// =====================================================
// FILTROS
// =====================================================

export type ResultsFilter = "TODOS" | MatchState;

// =====================================================
// CONFIGURACION
// =====================================================

export const RESULT_REFRESH_MS = 5_000;

export const RESULTS_TZ = "America/El_Salvador";

// =====================================================
// FECHA Y HORA
// =====================================================

export function formatResultDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return date.toLocaleString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: RESULTS_TZ,
  });
}

// =====================================================
// PARTIDOS DEL DIA ACTUAL
// =====================================================

export function matchesToday(matches: ResultMatch[]): number {
  const localDay = (value: Date) =>
    value.toLocaleDateString("en-CA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: RESULTS_TZ,
    });

  const today = localDay(new Date());

  return matches.filter(
    (match) =>
      localDay(new Date(match.fechaHoraInicio)) === today,
  ).length;
}
