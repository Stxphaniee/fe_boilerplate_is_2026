"use client";

import { useState } from "react";

import { getErrorMessage } from "@/lib/api/errors";

import {
  useRefereePanelQuery,
} from "@/queries/referee/referee.queries";

import {
  useCreateLiveEventMutation,
  useRegisterParticipantsMutation,
  useUpdateLiveMatchStateMutation,
} from "@/queries/referee/referee.mutations";

import { useMatchClock } from "./use-match-clock";

import type {
  MatchEventFormData,
  LiveMatchAction,
  PanelNotice,
  CreateMatchEventRequest,
} from "@/types/referee.types";

const INITIAL_FORM: MatchEventFormData = {
  tipo: "GOL",
  jugadorId: "",
  minuto: "",
  golRelacionadoId: "",
};

export function useRefereePanel(
  userId: string,
  matchId: string,
) {
  const panelQuery = useRefereePanelQuery(
    userId,
    matchId,
  );

  const stateMutation =
    useUpdateLiveMatchStateMutation(
      userId,
      matchId,
    );

  const eventMutation =
    useCreateLiveEventMutation(
      userId,
      matchId,
    );

  const participantMutation =
    useRegisterParticipantsMutation(
      userId,
      matchId,
    );

  const [form, setForm] =
    useState<MatchEventFormData>(INITIAL_FORM);

  const [participantDraft, setParticipantDraft] =
    useState<Record<string, boolean>>({});

  const [notice, setNotice] =
    useState<PanelNotice | null>(null);

  const panel = panelQuery.data;

  const clock = useMatchClock(
    panel,
    panelQuery.dataUpdatedAt,
  );

  const isBusy =
    stateMutation.isPending ||
    eventMutation.isPending ||
    participantMutation.isPending;

  const canManage =
    Boolean(panel) &&
    !panelQuery.isError &&
    !isBusy;

  const canRegister =
    canManage &&
    panel?.estado === "EN_CURSO";

  const canStart =
    canManage &&
    panel?.estado === "PROGRAMADO";

  const canFinish =
    canManage &&
    panel?.estado === "EN_CURSO";

  const eligiblePlayers =
    panel?.jugadores.filter(
      (player) => player.activo,
    ) ?? [];

  const selectedPlayer =
    eligiblePlayers.find(
      (player) =>
        player.id === form.jugadorId,
    );

  const availableGoals =
    selectedPlayer
      ? (
          panel?.eventos.filter(
            (event) =>
              event.tipo === "GOL" &&
              event.equipoId ===
                selectedPlayer.equipoId &&
              event.jugadorId !==
                selectedPlayer.id,
          ) ?? []
        )
      : [];

  const selectedGoal =
    availableGoals.find(
      (goal) =>
        goal.id === form.golRelacionadoId,
    );

  const suggestedMinute =
    form.tipo === "ASISTENCIA" &&
    selectedGoal
      ? selectedGoal.minuto
      : clock.minute;

  const participantChanges = (
    panel?.jugadores ?? []
  )
    .filter(
      (player) =>
        player.activo &&
        participantDraft[player.id] !==
          undefined &&
        participantDraft[player.id] !==
          player.participo,
    )
    .map((player) => ({
      jugadorId: player.id,
      participo: participantDraft[player.id],
    }));

  const hasParticipantChanges =
    participantChanges.length > 0;

  function showError(message: string) {
    setNotice({
      type: "error",
      message,
    });
  }

  function showSuccess(message: string) {
    setNotice({
      type: "success",
      message,
    });
  }

  // =====================================================
  // FORMULARIO DE EVENTOS
  // =====================================================

  function changeEventField<
    K extends keyof MatchEventFormData,
  >(
    field: K,
    value: MatchEventFormData[K],
  ) {
    setNotice(null);

    setForm((previous) => ({
      ...previous,
      [field]: value,

      ...(
        field === "tipo" ||
        field === "jugadorId"
          ? { golRelacionadoId: "" }
          : {}
      ),
    }));
  }

  async function saveEvent(): Promise<boolean> {
    if (!canRegister) return false;

    setNotice(null);

    if (!selectedPlayer) {
      showError(
        "Debes seleccionar un jugador de los equipos contendientes.",
      );

      return false;
    }

    const minute =
      form.minuto.trim() === ""
        ? suggestedMinute
        : Number(form.minuto);

    if (
      minute === null ||
      !Number.isInteger(minute) ||
      minute < 0 ||
      minute > 2_147_483_647
    ) {
      showError(
        "Ingresa un minuto entero válido y no negativo.",
      );

      return false;
    }

    if (
      form.tipo === "ASISTENCIA" &&
      !selectedGoal
    ) {
      showError(
        "Selecciona un gol válido del mismo equipo para registrar la asistencia.",
      );

      return false;
    }

    const payload: CreateMatchEventRequest = {
      jugadorId: selectedPlayer.id,
      tipo: form.tipo,
      minuto: minute,

      ...(form.tipo === "ASISTENCIA" &&
      selectedGoal
        ? {
            golRelacionadoId: selectedGoal.id,
          }
        : {}),
    };

    try {
      await eventMutation.mutateAsync(payload);

      setForm((previous) => ({
        ...previous,
        jugadorId: "",
        minuto: "",
        golRelacionadoId: "",
      }));

      showSuccess(
        "Incidencia registrada correctamente.",
      );

      return true;
    } catch (error) {
      showError(getErrorMessage(error));

      return false;
    }
  }

  // =====================================================
  // PARTICIPACIONES
  // =====================================================

  function changeParticipant(
    playerId: string,
    checked: boolean,
  ) {
    if (!canRegister) return;

    const player = eligiblePlayers.find(
      (item) => item.id === playerId,
    );

    if (!player) return;

    setParticipantDraft((previous) => {
      const next = { ...previous };

      if (checked === player.participo) {
        delete next[playerId];
      } else {
        next[playerId] = checked;
      }

      return next;
    });

    setNotice(null);
  }

  async function saveParticipants(): Promise<boolean> {
    if (
      !canRegister ||
      !hasParticipantChanges
    ) {
      return false;
    }

    setNotice(null);

    try {
      await participantMutation.mutateAsync({
        participantes: participantChanges,
      });

      setParticipantDraft({});

      showSuccess(
        "Participaciones guardadas correctamente.",
      );

      return true;
    } catch (error) {
      showError(getErrorMessage(error));

      return false;
    }
  }

  // =====================================================
  // ESTADO DEL PARTIDO
  // =====================================================

  async function changeMatchState(
    nextState: LiveMatchAction,
  ): Promise<boolean> {
    if (
      nextState === "EN_CURSO" &&
      !canStart
    ) {
      return false;
    }

    if (
      nextState === "FINALIZADO" &&
      !canFinish
    ) {
      return false;
    }

    setNotice(null);

    if (
      nextState === "FINALIZADO" &&
      hasParticipantChanges
    ) {
      showError(
        "Guarda las participaciones pendientes antes de finalizar el partido.",
      );

      return false;
    }

    try {
      await stateMutation.mutateAsync(
        nextState,
      );

      showSuccess(
        nextState === "EN_CURSO"
          ? "Partido iniciado correctamente."
          : "Partido finalizado. El resultado es oficial.",
      );

      return true;
    } catch (error) {
      showError(getErrorMessage(error));

      // La accion pudo haber cambiado el estado
      // antes de que ocurriera otro error.
      await panelQuery.refetch();

      return false;
    }
  }

  return {
    panel,
    panelQuery,

    clock,

    form,
    changeEventField,
    selectedPlayer,
    availableGoals,
    eligiblePlayers,
    suggestedMinute,
    saveEvent,

    participantDraft,
    changeParticipant,
    saveParticipants,
    hasParticipantChanges,

    canRegister,
    canStart,
    canFinish,
    changeMatchState,

    isBusy,

    isSavingEvent:
      eventMutation.isPending,

    isSavingParticipants:
      participantMutation.isPending,

    isChangingState:
      stateMutation.isPending,

    notice,

    clearNotice: () => setNotice(null),
  };
}