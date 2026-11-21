
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

import type {
  CreateMatchRequest,
  CreateRoundRequest,
  MatchEditData,
  MatchResponse,
  RoundResponse,
  AvailableTeamOption,
  RefereeOption,
  UpdateMatchRequest,
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
 * Localiza un partido dentro de las jornadas de la temporada activa.
 *
 * Si la pantalla se abre desde la tabla de partidos, recibe jornadaId
 * para consultar primero esa jornada. Si se abre directamente, recorre
 * las jornadas disponibles hasta encontrar el partido.
 */
export async function getMatchForEdit(
  matchId: string,
  preferredRoundId?: string,
): Promise<MatchEditData> {
  const rounds = await getRounds();

  if (rounds.length === 0) {
    throw new ApiError(
      404,
      "No hay jornadas disponibles para consultar el partido.",
    );
  }

  const preferredRound = preferredRoundId
    ? rounds.find((round) => round.id === preferredRoundId)
    : undefined;

  async function findInRounds(
    candidateRounds: RoundResponse[],
  ): Promise<{ match: MatchResponse; round: RoundResponse } | null> {
    const results = await Promise.all(
      candidateRounds.map(async (round) => ({
        round,
        matches: await getRoundMatches(round.id),
      })),
    );

    for (const result of results) {
      const match = result.matches.find((item) => item.id === matchId);

      if (match) {
        return {
          match,
          round: result.round,
        };
      }
    }

    return null;
  }

  let found = await findInRounds(
    preferredRound ? [preferredRound] : rounds,
  );

  // Si el ID de jornada recibido no corresponde al partido,
  // buscamos en las demás jornadas de la temporada.
  if (!found && preferredRound) {
    found = await findInRounds(
      rounds.filter((round) => round.id !== preferredRound.id),
    );
  }

  if (!found) {
    throw new ApiError(404, "No se encontró el partido solicitado.");
  }

  const [teams, referees] = await Promise.all([
    getAvailableTeams(),
    getReferees(),
  ]);

  const localTeam = teams.find(
    (team) => team.id === found.match.equipoLocalId,
  );

  const awayTeam = teams.find(
    (team) => team.id === found.match.equipoVisitanteId,
  );

  const referee = referees.find(
    (item) => item.id === found.match.arbitroId,
  );

  return {
    match: found.match,
    jornadaNumero: found.round.numero,
    equipoLocalNombre:
      localTeam?.name ?? `Equipo ${found.match.equipoLocalId.slice(0, 8)}`,
    equipoVisitanteNombre:
      awayTeam?.name ?? `Equipo ${found.match.equipoVisitanteId.slice(0, 8)}`,
    arbitroNombre:
      referee?.name ??
      referee?.email ??
      `Árbitro ${found.match.arbitroId.slice(0, 8)}`,
  };
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

/**
 * Modifica, suspende, reprograma o cancela un partido.
 * PATCH /api/v1/partidos/:id
 */
export async function updateMatch(
  matchId: string,
  data: UpdateMatchRequest,
): Promise<MatchResponse> {
  return apiRequest<MatchResponse>(`partidos/${matchId}`, {
    method: "PATCH",
    body: data,
  });
}
