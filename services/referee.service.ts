import { apiRequest } from "@/lib/api/client";

import type {
  RefereeMatch,
  RefereePanel,
  LiveMatchAction,
  MatchStateUpdateResponse,
  CreateMatchEventRequest,
  CreateMatchEventResponse,
  RegisterParticipantsRequest,
  MatchParticipationResponse,
} from "@/types/referee.types";

// =====================================================
// PARTIDOS ASIGNADOS
// =====================================================

export function getRefereeMatches(
  signal?: AbortSignal,
): Promise<RefereeMatch[]> {
  return apiRequest<RefereeMatch[]>(
    "arbitro/mis-partidos",
    {
      method: "GET",
      signal,
    },
  );
}

// =====================================================
// PANEL DE CONTROL
// =====================================================

export function getRefereePanel(
  matchId: string,
  signal?: AbortSignal,
): Promise<RefereePanel> {
  return apiRequest<RefereePanel>(
    `arbitro/partidos/${encodeURIComponent(matchId)}`,
    {
      method: "GET",
      signal,
    },
  );
}

// =====================================================
// INICIAR Y FINALIZAR PARTIDO
// =====================================================

export function updateLiveMatchState(
  matchId: string,
  estado: LiveMatchAction,
): Promise<MatchStateUpdateResponse> {
  return apiRequest<MatchStateUpdateResponse>(
    `partidos/${encodeURIComponent(matchId)}/estado`,
    {
      method: "PATCH",
      body: { estado },
    },
  );
}

// =====================================================
// REGISTRAR EVENTOS
// =====================================================

export function createLiveMatchEvent(
  matchId: string,
  data: CreateMatchEventRequest,
): Promise<CreateMatchEventResponse> {
  return apiRequest<CreateMatchEventResponse>(
    `partidos/${encodeURIComponent(matchId)}/eventos`,
    {
      method: "POST",
      body: data,
    },
  );
}

// =====================================================
// REGISTRAR PARTICIPANTES
// =====================================================

export function registerLiveParticipants(
  matchId: string,
  data: RegisterParticipantsRequest,
): Promise<MatchParticipationResponse[]> {
  return apiRequest<MatchParticipationResponse[]>(
    `partidos/${encodeURIComponent(matchId)}/participantes`,
    {
      method: "POST",
      body: data,
    },
  );
}