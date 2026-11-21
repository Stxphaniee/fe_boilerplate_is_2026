
"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/errors";

import {
  getPublicResults,
  getPublicMatchDetail,
} from "@/services/results.service";

import {
  RESULT_REFRESH_MS,
} from "@/types/results.types";

// =====================================================
// QUERY KEYS
// =====================================================

export const resultsKeys = {
  all: ["public-results"] as const,

  list: () =>
    [...resultsKeys.all, "list"] as const,

  detail: (id: string) =>
    [...resultsKeys.all, "detail", id] as const,
};

// =====================================================
// LISTADO PUBLICO
// =====================================================

export function usePublicResultsQuery() {
  return useQuery({
    queryKey: resultsKeys.list(),

    queryFn: ({ signal }) =>
      getPublicResults(signal),

    retry: false,
    staleTime: 0,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    refetchInterval: RESULT_REFRESH_MS,
    refetchIntervalInBackground: false,
  });
}

// =====================================================
// DETALLE DE PARTIDO
// =====================================================

export function usePublicMatchQuery(id: string) {
  return useQuery({
    queryKey: resultsKeys.detail(id),

    queryFn: ({ signal }) =>
      getPublicMatchDetail(id, signal),

    enabled: Boolean(id),

    retry: false,
    staleTime: 0,

    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    refetchIntervalInBackground: false,

    refetchInterval: (query) => {
      const error = query.state.error;

      if (
        error instanceof ApiError &&
        [400, 403, 404].includes(error.status)
      ) {
        return false;
      }

      const estado = query.state.data?.estado;

      if (
        estado === "FINALIZADO" ||
        estado === "CANCELADO"
      ) {
        return false;
      }

      return RESULT_REFRESH_MS;
    },
  });
}
