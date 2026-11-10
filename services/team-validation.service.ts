
import { apiRequest } from "@/lib/api/client";

import type {
  ValidationTeam,
  ValidationStats,
  UpdateTeamStatusRequest,
} from "@/queries/teams/team-validation.types";

export async function getPendingTeams(): Promise<ValidationTeam[]> {
  return apiRequest<ValidationTeam[]>("teams/pending", {
    method: "GET",
  });
}

export async function getTeamForReview(
  teamId: string,
): Promise<ValidationTeam> {
  return apiRequest<ValidationTeam>(`teams/${teamId}`, {
    method: "GET",
  });
}

export async function getValidationStats(): Promise<ValidationStats> {
  return apiRequest<ValidationStats>("teams/stats", {
    method: "GET",
  });
}

export async function updateTeamStatus(
  teamId: string,
  data: UpdateTeamStatusRequest,
): Promise<ValidationTeam> {
  return apiRequest<ValidationTeam>(
    `teams/${teamId}/status`,
    {
      method: "PATCH",
      body: data,
    },
  );
}
