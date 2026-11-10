
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTeam,
  resubmitTeam,
} from "@/services/teams.service";

import type {
  CreateTeamRequest,
  ResubmitTeamRequest,
} from "@/types/teams.types";

import { teamKeys } from "./teams.queries";

// ==========================================
// HU1 - REGISTRO DE EQUIPOS
// ==========================================

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamRequest) =>
      createTeam(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teamKeys.mine(),
      });
    },
  });
}

// ==========================================
// HU2 - CORRECCIÓN Y REENVÍO
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
