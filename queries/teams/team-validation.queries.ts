
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getPendingTeams,
  getTeamForReview,
  getValidationStats,
  updateTeamStatus,
} from "@/services/team-validation.service";

import type {
  UpdateTeamStatusRequest,
} from "@/queries/teams/team-validation.types";

import { teamKeys } from "./teams.queries";

export const teamValidationKeys = {
  all: [...teamKeys.all, "validation"] as const,

  pending: () =>
    [...teamValidationKeys.all, "pending"] as const,

  stats: () =>
    [...teamValidationKeys.all, "stats"] as const,

  detail: (teamId: string) =>
    [...teamValidationKeys.all, "detail", teamId] as const,
};

export function usePendingTeamsQuery() {
  return useQuery({
    queryKey: teamValidationKeys.pending(),
    queryFn: getPendingTeams,
    retry: false,
    staleTime: 30_000,
  });
}

export function useValidationStatsQuery() {
  return useQuery({
    queryKey: teamValidationKeys.stats(),
    queryFn: getValidationStats,
    retry: false,
    staleTime: 30_000,
  });
}

export function useTeamReviewQuery(
  teamId: string | null,
) {
  return useQuery({
    queryKey: teamValidationKeys.detail(teamId ?? ""),
    queryFn: () => getTeamForReview(teamId!),
    enabled: Boolean(teamId),
    retry: false,
  });
}

export function useUpdateTeamStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: UpdateTeamStatusRequest;
    }) => updateTeamStatus(teamId, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: teamValidationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: teamKeys.mine(),
        }),
      ]);
    },
  });
}
