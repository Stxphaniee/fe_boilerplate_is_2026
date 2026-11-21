
"use client";

import { useState } from "react";

import {
  useUpdateMatchMutation,
} from "@/queries/matches/matches.mutations";

import { getErrorMessage } from "@/lib/api/errors";

import type {
  CourtOption,
  MatchEditData,
  UpdateMatchRequest,
} from "@/types/matches.types";

function getLocalDateTimeParts(value: string): {
  date: string;
  time: string;
} {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { date: "", time: "" };
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
  const minutes = String(parsed.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

export function useMatchEdit(
  matchId: string,
  data: MatchEditData,
) {
  const updateMutation = useUpdateMatchMutation(matchId);

  const [initialParts] = useState(() =>
    getLocalDateTimeParts(data.match.fechaHoraInicio),
  );

  const [date, setDate] = useState(initialParts.date);
  const [time, setTime] = useState(initialParts.time);
  const [court, setCourt] = useState<CourtOption>(data.match.cancha);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const match = data.match;

  const isSuspended = match.estado === "SUSPENDIDO";

  const canEdit =
    match.estado === "PROGRAMADO" ||
    match.estado === "SUSPENDIDO";

  const canSuspend = match.estado === "PROGRAMADO";

  const canCancel =
    match.estado === "PROGRAMADO" ||
    match.estado === "SUSPENDIDO";

  const originalParts = getLocalDateTimeParts(match.fechaHoraInicio);

  const hasChanges =
    date !== originalParts.date ||
    time !== originalParts.time ||
    court !== match.cancha;

  const canSave =
    canEdit &&
    Boolean(date) &&
    Boolean(time) &&
    (isSuspended || hasChanges);

  function clearMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  function changeDate(value: string) {
    clearMessages();
    setDate(value);
  }

  function changeTime(value: string) {
    clearMessages();
    setTime(value);
  }

  function changeCourt(value: CourtOption) {
    clearMessages();
    setCourt(value);
  }

  function buildStartDateTime(): string | null {
    if (!date || !time) {
      setErrorMessage(
        "Debes indicar la nueva fecha y hora del partido.",
      );
      return null;
    }

    const start = new Date(`${date}T${time}:00`);

    if (Number.isNaN(start.getTime())) {
      setErrorMessage(
        "La fecha y hora ingresadas no son válidas.",
      );
      return null;
    }

    if (start.getTime() <= Date.now()) {
      setErrorMessage(
        "La nueva fecha del partido debe ser futura.",
      );
      return null;
    }

    return start.toISOString();
  }

  async function saveChanges(): Promise<boolean> {
    if (!canEdit) return false;

    clearMessages();

    if (!isSuspended && !hasChanges) {
      setErrorMessage("No has realizado ningún cambio.");
      return false;
    }

    const fechaHoraInicio = buildStartDateTime();

    if (!fechaHoraInicio) return false;

    const payload: UpdateMatchRequest = {
      fechaHoraInicio,
      cancha: court,
      ...(isSuspended ? { estado: "PROGRAMADO" } : {}),
    };

    try {
      await updateMutation.mutateAsync(payload);

      setSuccessMessage(
        isSuspended
          ? "Partido reprogramado correctamente."
          : "Cambios guardados correctamente.",
      );

      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return false;
    }
  }

  async function suspendMatch(reason: string): Promise<boolean> {
    if (match.estado !== "PROGRAMADO") return false;

    clearMessages();

    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      setErrorMessage(
        "Debes indicar el motivo de la suspensión.",
      );
      return false;
    }

    if (normalizedReason.length > 250) {
      setErrorMessage(
        "El motivo no puede superar los 250 caracteres.",
      );
      return false;
    }

    try {
      await updateMutation.mutateAsync({
        estado: "SUSPENDIDO",
        motivoSuspension: normalizedReason,
      });

      setSuccessMessage("Partido suspendido correctamente.");
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return false;
    }
  }

  async function cancelMatch(): Promise<boolean> {
    if (!canCancel) return false;

    clearMessages();

    try {
      await updateMutation.mutateAsync({
        estado: "CANCELADO",
      });

      setSuccessMessage("Partido cancelado correctamente.");
      return true;
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      return false;
    }
  }

  return {
    date,
    time,
    court,
    changeDate,
    changeTime,
    changeCourt,

    canEdit,
    canSave,
    canSuspend,
    canCancel,
    isSuspended,

    saveChanges,
    suspendMatch,
    cancelMatch,

    isSaving: updateMutation.isPending,
    errorMessage,
    successMessage,
    clearMessages,
  };
}
