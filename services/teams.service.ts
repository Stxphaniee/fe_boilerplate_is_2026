import type { CreateTeamRequest, TeamResponse } from "@/types/teams.types";
import { apiRequest } from "@/lib/api/client";

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

import type { ResubmitTeamRequest } from "@/types/teams.types";

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
