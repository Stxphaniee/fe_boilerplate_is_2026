"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";

import {
  updateLiveMatchState,
  createLiveMatchEvent,
  registerLiveParticipants,
} from "@/services/referee.service";

import type {
  LiveMatchAction,
  CreateMatchEventRequest,
  RegisterParticipantsRequest,
} from "@/types/referee.types";

import { refereeKeys } from "./referee.queries";

async function invalidateMatchData(
  queryClient: QueryClient,
  userId: string,
  matchId: string,
) {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: refereeKeys.panel(userId, matchId),
    }),

    queryClient.invalidateQueries({
      queryKey: refereeKeys.matches(userId),
    }),

    queryClient.invalidateQueries({
      queryKey: ["calendar"],
    }),
  ]);
}

// =====================================================
// ESTADO DEL PARTIDO
// =====================================================

export function useUpdateLiveMatchStateMutation(
  userId: string,
  matchId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (estado: LiveMatchAction) =>
      updateLiveMatchState(matchId, estado),

    onSuccess: () =>
      invalidateMatchData(
        queryClient,
        userId,
        matchId,
      ),
  });
}

// =====================================================
// EVENTOS DEL PARTIDO
// =====================================================

export function useCreateLiveEventMutation(
  userId: string,
  matchId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchEventRequest) =>
      createLiveMatchEvent(matchId, data),

    onSuccess: () =>
      invalidateMatchData(
        queryClient,
        userId,
        matchId,
      ),
  });
}

// =====================================================
// PARTICIPANTES DEL PARTIDO
// =====================================================

export function useRegisterParticipantsMutation(
  userId: string,
  matchId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterParticipantsRequest) =>
      registerLiveParticipants(matchId, data),

    onSuccess: () =>
      invalidateMatchData(
        queryClient,
        userId,
        matchId,
      ),
  });
}