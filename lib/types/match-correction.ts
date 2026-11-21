export interface EditableGoalEvent {
  id: string;
  minute: number;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  type: string;
}

export interface TeamRosterPlayer {
  id: string;
  name: string;
  jerseyNumber: number;
  teamId: string;
  teamName: string;
}

export interface MatchCorrectionData {
  id: string;
  jornadaNumero: number;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  homeScore: number;
  awayScore: number;
  state: string;
  editableEvents: EditableGoalEvent[];
  roster: TeamRosterPlayer[];
}

export interface CorrectionPayload {
  justificacion: string;
  eventosCorregidos: Array<{
    playerId: string;
    minute: number;
    type: "GOL";
  }>;
}