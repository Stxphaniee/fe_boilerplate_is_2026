
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "@/services/teams.service";
import type { CreateTeamRequest } from "@/types/teams.types";
import { teamKeys } from "./teams.queries";

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
