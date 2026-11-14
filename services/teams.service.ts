import type {
  AddPlayerRequest,
  CreateTeamRequest,
  PlayerResponse,
  ResubmitTeamRequest,
  TeamResponse,
} from "@/types/teams.types";
import { apiRequest } from "@/lib/api/client";

// ==========================================
// H1 - INSCRIPCIÓN DE EQUIPOS
// ==========================================

/**
 * Registra un equipo en la temporada vigente.
 * Endpoint: POST /api/v1/teams
 */
export async function createTeam(
  data: CreateTeamRequest,
): Promise<TeamResponse> {
  return apiRequest<TeamResponse>("teams", {
    method: "POST",
    body: data,
  });
}

/**
 * Consulta el equipo del capitán autenticado.
 * Endpoint: GET /api/v1/teams/mine
 */
export async function getMyTeam(): Promise<TeamResponse> {
  return apiRequest<TeamResponse>("teams/mine", {
    method: "GET",
  });
}

// ==========================================
// H2 - CORRECCIÓN Y REENVÍO
// ==========================================

/**
 * Corrige y reenvía una inscripción rechazada.
 * PATCH /api/v1/teams/:id/resubmit
 */
export async function resubmitTeam(
  teamId: string,
  data: ResubmitTeamRequest,
): Promise<TeamResponse> {
  return apiRequest<TeamResponse>(`teams/${teamId}/resubmit`, {
    method: "PATCH",
    body: data,
  });
}

// ==========================================
// H3 - GESTIÓN DE PLANTILLA
// ==========================================

/**
 * Consulta los jugadores activos de la plantilla.
 * GET /api/v1/teams/:id/players
 */
export async function getTeamPlayers(
  teamId: string,
): Promise<PlayerResponse[]> {
  return apiRequest<PlayerResponse[]>(`teams/${teamId}/players`, {
    method: "GET",
  });
}

/**
 * Agrega un jugador a la plantilla.
 * POST /api/v1/teams/:id/players
 */
export async function addPlayer(
  teamId: string,
  data: AddPlayerRequest,
): Promise<PlayerResponse> {
  return apiRequest<PlayerResponse>(`teams/${teamId}/players`, {
    method: "POST",
    body: data,
  });
}

/**
 * Da de baja lógica a un jugador de la plantilla.
 * PATCH /api/v1/teams/:id/players/:playerId/leave
 */
export async function removePlayer(
  teamId: string,
  playerId: string,
): Promise<PlayerResponse> {
  return apiRequest<PlayerResponse>(
    `teams/${teamId}/players/${playerId}/leave`,
    { method: "PATCH" },
  );
}