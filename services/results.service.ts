
import { apiRequest } from "@/lib/api/client";

import type {
  ResultMatch,
  ResultMatchDetail,
} from "@/types/results.types";

// =====================================================
// HU8 - LISTADO PUBLICO DE RESULTADOS
// GET /api/v1/partidos/resultados
// =====================================================

export function getPublicResults(
  signal?: AbortSignal,
): Promise<ResultMatch[]> {
  return apiRequest<ResultMatch[]>(
    "partidos/resultados",
    {
      method: "GET",
      signal,
    },
  );
}

// =====================================================
// HU8 - DETALLE PUBLICO DE UN PARTIDO
// GET /api/v1/partidos/:id
// =====================================================

export function getPublicMatchDetail(
  matchId: string,
  signal?: AbortSignal,
): Promise<ResultMatchDetail> {
  return apiRequest<ResultMatchDetail>(
    `partidos/${encodeURIComponent(matchId)}`,
    {
      method: "GET",
      signal,
    },
  );
}
