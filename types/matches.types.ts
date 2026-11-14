export type RoundState = 'BORRADOR' | 'PUBLICADA';

export type MatchState =
  | 'PROGRAMADO'
  | 'EN_CURSO'
  | 'FINALIZADO'
  | 'SUSPENDIDO'
  | 'CANCELADO';

export type CourtOption = 'A' | 'B' | 'C';

export interface RoundResponse {
  id: string;
  numero: number;
  state: RoundState;
  publishedAt: string | null;
  seasonId: string;
  createdAt: string;
}

export interface MatchResponse {
  id: string;
  estado: MatchState;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  cancha: CourtOption;
  jornadaId: string;
  equipoLocalId: string;
  equipoVisitanteId: string;
  arbitroId: string;
  createdAt: string;
}

export interface CreateRoundRequest {
  numero: number;
}

export interface CreateMatchRequest {
  jornadaId: string;
  equipoLocalId: string;
  equipoVisitanteId: string;
  arbitroId: string;
  cancha: CourtOption;
  fechaHoraInicio: string;
}

export interface TeamOption {
  id: string;
  name: string;
}

export interface RefereeOption {
  id: string;
  email: string;
}

export interface AvailableTeamOption {
  id: string;
  name: string;
}

export interface RefereeOption {
  id: string;
  email: string;
  name?: string;
}