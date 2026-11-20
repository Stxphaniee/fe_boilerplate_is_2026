
import type {
  CourtOption,
  MatchState,
} from "@/types/matches.types";

export interface CalendarTeam {
  id: string;
  nombre: string;
}

export type MatchCondition =
  | "LOCAL"
  | "VISITANTE";

export interface CalendarMatch {
  id: string;
  jornada: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  cancha: CourtOption;
  estado: MatchState;
  condicion: MatchCondition;
  equipoLocal: CalendarTeam;
  equipoVisitante: CalendarTeam;
  rival: CalendarTeam;
}

export interface CalendarStats {
  teamName: string;
  upcoming: number;
  inProgress: number;
  finished: number;
}
