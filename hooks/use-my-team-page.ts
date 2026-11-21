"use client";

import { useState } from "react";
import { useMyTeamQuery } from "@/queries/teams/teams.queries";
import { useResubmitTeamMutation } from "@/queries/teams/teams.mutations";
import type { PlayerDraft } from "@/types/player.types";
import type { ResubmitTeamRequest } from "@/types/teams.types";

export function useMyTeamPage() {
  const teamQuery = useMyTeamQuery();
  const resubmitMutation = useResubmitTeamMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [players, setPlayers] = useState<PlayerDraft[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const team = teamQuery.data;

  function startEditing() {
    if (!team || team.status !== "RECHAZADO") return;

    setName(team.name);

    setPlayers(
      team.players.map((player) => ({
        id: player.id,
        name: player.name,
        dui: player.dui,
        birthDate: player.birthDate.slice(0, 10),
        position: player.position,
        jerseyNumber: player.jerseyNumber,
      })),
    );

    setValidationError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (resubmitMutation.isPending) return;

    setIsEditing(false);
    setValidationError(null);
  }

  async function submitCorrection() {
    if (!team) return;

    setValidationError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setValidationError("Debes indicar el nombre del equipo.");
      return;
    }

    if (players.length < 5 || players.length > 15) {
      setValidationError("La plantilla debe tener entre 5 y 15 jugadores.");
      return;
    }

    const data: ResubmitTeamRequest = {
      name: name.trim(),
      players: players.map((player) => ({
        name: player.name,
        dui: player.dui,
        birthDate: player.birthDate,
        position: player.position,
        jerseyNumber: Number(player.jerseyNumber),
      })),
    };

    try {
      await resubmitMutation.mutateAsync({
        teamId: team.id,
        data,
      });

      setIsEditing(false);
      setSuccessMessage(
        "Tu inscripción corregida fue reenviada para validación.",
      );
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "No fue posible reenviar la inscripción.",
      );
    }
  }

  return {
    team,
    isLoading: teamQuery.isLoading,
    isError: teamQuery.isError,
    error: teamQuery.error,
    refetch: teamQuery.refetch,

    isEditing,
    startEditing,
    cancelEditing,

    name,
    setName,
    players,
    setPlayers,

    submitCorrection,
    isSubmitting: resubmitMutation.isPending,
    validationError,
    successMessage,
  };
}
