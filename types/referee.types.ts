import type {
  CourtOption,
  MatchState,
} from "@/types/matches.types";

export type MatchEventType =
  | "GOL"
  | "ASISTENCIA"
  | "AMARILLA"
  | "ROJA";

export type LiveMatchAction =
  | "EN_CURSO"
  | "FINALIZADO";

export type PlayerPosition =
  | "PORTERO"
  | "DEFENSA"
  | "MEDIOCAMPISTA"
  | "DELANTERO";

export interface RefereeTeam {
  id: string;
  nombre: string;
}

export interface RefereeScoreTeam extends RefereeTeam {
  goles: number;
}

export interface RefereeMatch {
  id: string;
  jornada: number;
  estado: MatchState;
  cancha: CourtOption;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  equipoLocal: RefereeTeam;
  equipoVisitante: RefereeTeam;
}

export interface RefereePlayer {
  id: string;
  nombre: string;
  equipoId: string;
  dorsal: number;
  posicion: PlayerPosition;
  activo: boolean;
  participo: boolean;
}

export interface MatchLiveEvent {
  id: string;
  jugadorId: string;
  jugador: string;
  equipoId: string;
  tipo: MatchEventType;
  minuto: number;
  golRelacionadoId: string | null;
  createdAt: string;
}

export interface RefereePanel extends RefereeMatch {
  inicioReal: string | null;
  finReal: string | null;
  servidorAhora: string;

  equipoLocal: RefereeScoreTeam;
  equipoVisitante: RefereeScoreTeam;

  jugadores: RefereePlayer[];
  eventos: MatchLiveEvent[];
}

export interface CreateMatchEventRequest {
  jugadorId: string;
  tipo: MatchEventType;
  minuto: number;
  golRelacionadoId?: string;
}

export interface MatchParticipantInput {
  jugadorId: string;
  participo: boolean;
}

export interface RegisterParticipantsRequest {
  participantes: MatchParticipantInput[];
}

export interface MatchParticipationResponse {
  id: string;
  partidoId: string;
  jugadorId: string;
  participo: boolean;
}

export interface MatchStateUpdateResponse {
  id: string;
  estado: MatchState;
  updatedAt: string;
}

export interface PublicScoreboard {
  partidoId: string;
  jornada: number;
  estado: MatchState;
  cancha: CourtOption;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  equipoLocal: RefereeScoreTeam;
  equipoVisitante: RefereeScoreTeam;
  actualizadoEn: string;
}

export interface CreateMatchEventResponse {
  evento: MatchLiveEvent;
  marcador: PublicScoreboard;
}

export interface MatchEventFormData {
  tipo: MatchEventType;
  jugadorId: string;
  minuto: string;
  golRelacionadoId: string;
}

export interface MatchClock {
  elapsedSeconds: number | null;
  minute: number | null;
  display: string;
  isRunning: boolean;
  progress: number;
}

export interface PanelNotice {
  type: "success" | "error";
  message: string;
}