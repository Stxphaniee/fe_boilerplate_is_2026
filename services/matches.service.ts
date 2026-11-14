import { apiRequest } from "@/lib/api/client";

import type {
  CreateMatchRequest,
  CreateRoundRequest,
  MatchResponse,
  RoundResponse,
  AvailableTeamOption,
  RefereeOption,
} from "@/types/matches.types";

/**
 * Consulta todas las jornadas de la temporada activa.
 * GET /api/v1/jornadas
 */
export async function getRounds(): Promise<RoundResponse[]> {
  return apiRequest<RoundResponse[]>("jornadas", {
    method: "GET",
  });
}

/**
 * Consulta los equipos disponibles para programar partidos.
 * GET /api/v1/equipos-disponibles
 */
export async function getAvailableTeams(): Promise<AvailableTeamOption[]> {
  return apiRequest<AvailableTeamOption[]>("equipos-disponibles", {
    method: "GET",
  });
}

/**
 * Consulta los usuarios con rol ARBITRO.
 * GET /api/v1/arbitros
 */
export async function getReferees(): Promise<RefereeOption[]> {
  return apiRequest<RefereeOption[]>("arbitros", {
    method: "GET",
  });
}

/**
 * Consulta los partidos de una jornada.
 * GET /api/v1/jornadas/:id/partidos
 */
export async function getRoundMatches(
  roundId: string,
): Promise<MatchResponse[]> {
  return apiRequest<MatchResponse[]>(
    `jornadas/${roundId}/partidos`,
    {
      method: "GET",
    },
  );
}

/**
 * Crea una jornada en estado BORRADOR.
 * POST /api/v1/jornadas
 */
export async function createRound(
  data: CreateRoundRequest,
): Promise<RoundResponse> {
  return apiRequest<RoundResponse>("jornadas", {
    method: "POST",
    body: data,
  });
}

/**
 * Publica una jornada BORRADOR.
 * PATCH /api/v1/jornadas/:id/publicar
 */
export async function publishRound(
  roundId: string,
): Promise<RoundResponse> {
  return apiRequest<RoundResponse>(
    `jornadas/${roundId}/publicar`,
    {
      method: "PATCH",
    },
  );
}

/**
 * Programa un partido en una jornada BORRADOR.
 * POST /api/v1/partidos
 */
export async function createMatch(
  data: CreateMatchRequest,
): Promise<MatchResponse> {
  return apiRequest<MatchResponse>("partidos", {
    method: "POST",
    body: data,
  });
}