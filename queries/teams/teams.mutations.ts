import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPlayer,
  createTeam,
  removePlayer,
  resubmitTeam,
} from "@/services/teams.service";
import type {
  AddPlayerRequest,
  CreateTeamRequest,
  ResubmitTeamRequest,
} from "@/types/teams.types";
import { teamKeys } from "./teams.queries";

// ==========================================
// H1 - REGISTRO DE EQUIPOS
// ==========================================

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) => createTeam(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.mine(),
      });
    },
  });
}

// ==========================================
// H2 - CORRECCIÓN Y REENVÍO
// ==========================================

export function useResubmitTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: ResubmitTeamRequest;
    }) => resubmitTeam(teamId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.mine(),
      });
    },
  });
}

// ==========================================
// H3 - GESTIÓN DE PLANTILLA
// ==========================================

export function useAddPlayerMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPlayerRequest) => addPlayer(teamId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.players(teamId),
      });
      await queryClient.invalidateQueries({
        queryKey: teamKeys.mine(),
      });
    },
  });
}

export function useRemovePlayerMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playerId: string) => removePlayer(teamId, playerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.players(teamId),
      });
      await queryClient.invalidateQueries({
        queryKey: teamKeys.mine(),
      });
    },
  });
}