import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createMatch,
  createRound,
  publishRound,
} from "@/services/matches.service";

import type {
  CreateMatchRequest,
  CreateRoundRequest,
} from "@/types/matches.types";

import { matchKeys } from "./matches.queries";

/**
 * Crear jornada.
 */
export function useCreateRoundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoundRequest) =>
      createRound(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: matchKeys.rounds(),
      });
    },
  });
}

/**
 * Programar partido.
 */
export function useCreateMatchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchRequest) =>
      createMatch(data),

    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: matchKeys.rounds(),
        }),

        queryClient.invalidateQueries({
          queryKey: matchKeys.roundMatches(
            variables.jornadaId,
          ),
        }),
      ]);
    },
  });
}

/**
 * Publicar jornada.
 */
export function usePublishRoundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roundId: string) =>
      publishRound(roundId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: matchKeys.rounds(),
      });
    },
  });
}