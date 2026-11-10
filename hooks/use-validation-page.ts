
"use client";

import { useMemo, useState } from "react";

import {
  usePendingTeamsQuery,
  useValidationStatsQuery,
  useTeamReviewQuery,
  useUpdateTeamStatusMutation,
} from "@/queries/teams/team-validation.queries";

export function useValidationPage() {
  const [selectedTeamId, setSelectedTeamId] =
    useState<string | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] =
    useState(false);

  const [rejectionReason, setRejectionReason] =
    useState("");

  const [actionError, setActionError] =
    useState<string | null>(null);

  const pendingQuery = usePendingTeamsQuery();

  const statsQuery = useValidationStatsQuery();

  const detailQuery = useTeamReviewQuery(selectedTeamId);

  const updateStatusMutation =
    useUpdateTeamStatusMutation();

  const pendingTeams = pendingQuery.data ?? [];

  const selectedTeam = detailQuery.data ?? null;

  const pendingCount = pendingTeams.length;

  const canReview = useMemo(() => {
    return (
      selectedTeam?.status === "PENDIENTE_VALIDACION" &&
      !updateStatusMutation.isPending
    );
  }, [
    selectedTeam?.status,
    updateStatusMutation.isPending,
  ]);

  function selectTeam(teamId: string) {
    setSelectedTeamId(teamId);
    setActionError(null);
  }

  async function approveTeam() {
    if (!selectedTeam || !canReview) return;

    setActionError(null);

    try {
      await updateStatusMutation.mutateAsync({
        teamId: selectedTeam.id,
        data: {
          status: "APROBADO",
        },
      });

      setSelectedTeamId(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo aprobar la inscripción.",
      );
    }
  }

  function openRejectModal() {
    if (!canReview) return;

    setRejectionReason("");
    setActionError(null);
    setIsRejectModalOpen(true);
  }

  function closeRejectModal() {
    if (updateStatusMutation.isPending) return;

    setIsRejectModalOpen(false);
    setRejectionReason("");
  }

  async function rejectTeam() {
    if (
      !selectedTeam ||
      !canReview ||
      !rejectionReason.trim() ||
      rejectionReason.trim().length > 250
    ) {
      return;
    }

    setActionError(null);

    try {
      await updateStatusMutation.mutateAsync({
        teamId: selectedTeam.id,
        data: {
          status: "RECHAZADO",
          rejectionReason: rejectionReason.trim(),
        },
      });

      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedTeamId(null);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "No se pudo rechazar la inscripción.",
      );
    }
  }

  async function refetch() {
    await Promise.all([
      pendingQuery.refetch(),
      statsQuery.refetch(),
    ]);
  }

  return {
    pendingTeams,
    pendingCount,
    stats: statsQuery.data,

    selectedTeam,
    selectedTeamId,
    selectTeam,

    isLoading: pendingQuery.isLoading,
    isError: pendingQuery.isError,
    queryError: pendingQuery.error,
    refetch,

    isStatsLoading: statsQuery.isLoading,
    isStatsError: statsQuery.isError,

    isDetailLoading: detailQuery.isLoading,
    isDetailError: detailQuery.isError,

    isSaving: updateStatusMutation.isPending,
    canReview,
    actionError,

    approveTeam,
    rejectTeam,

    isRejectModalOpen,
    openRejectModal,
    closeRejectModal,

    rejectionReason,
    setRejectionReason,
  };
}
