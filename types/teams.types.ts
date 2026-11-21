export type TeamState =
  | "PENDIENTE_VALIDACION"
  | "APROBADO"
  | "RECHAZADO"
  | "SUSPENDIDO";

export type PlayerPosition =
  | "PORTERO"
  | "DEFENSA"
  | "MEDIOCAMPISTA"
  | "DELANTERO";

export interface CreatePlayerRequest {
  name: string;
  dui: string;
  birthDate: string;
  position: PlayerPosition;
  jerseyNumber: number;
}

export interface PlayerResponse {
  id: string;
  name: string;
  dui: string;
  birthDate: string;
  position: PlayerPosition;
  jerseyNumber: number;
  leftAt?: string | null;
}

export interface CreateTeamRequest {
  name: string;
  shortName: string;
  seasonId?: string;
  players: CreatePlayerRequest[];
}

export interface TeamResponse {
  id: string;
  name: string;
  shortName: string;
  status: TeamState;
  rejectionReason: string | null;
  seasonId: string;
  captainId: string;
  createdAt: string;
  players: PlayerResponse[];
}

export interface ResubmitTeamRequest {
  name?: string;
  players: CreatePlayerRequest[];
}

// ==========================================
// H3 - GESTIÓN DE PLANTILLA
// ==========================================

export interface AddPlayerRequest {
  name: string;
  dui: string;
  birthDate: string;
  position: PlayerPosition;
  jerseyNumber: number;
}