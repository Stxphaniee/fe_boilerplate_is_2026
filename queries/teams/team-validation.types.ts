export type TeamValidationStatus =
  | "PENDIENTE_VALIDACION"
  | "APROBADO"
  | "RECHAZADO"
  | "SUSPENDIDO";

export type PlayerPosition =
  | "PORTERO"
  | "DEFENSA"
  | "MEDIOCAMPISTA"
  | "DELANTERO";

export interface ValidationPlayer {
  id: string;
  name: string;
  dui: string;
  birthDate: string;
  position: PlayerPosition;
  jerseyNumber: number;
}

export interface ValidationCaptain {
  id: string;
  email: string;
}

export interface ValidationTeam {
  id: string;
  seasonId: string;
  captainId: string;
  name: string;
  shortName: string;
  status: TeamValidationStatus;
  rejectionReason: string | null;
  createdAt: string;
  players: ValidationPlayer[];
  captainEmail?: string;
}

export interface UpdateTeamStatusRequest {
  status: "APROBADO" | "RECHAZADO";
  rejectionReason?: string;
}

export interface ValidationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}
