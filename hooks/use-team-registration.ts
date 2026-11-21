
"use client";

import { useState } from "react";
import { useCreateTeamMutation } from "@/queries/teams/teams.mutations";
import type { PlayerDraft } from "@/types/player.types";
import type {
  CreateTeamRequest,
  PlayerPosition,
} from "@/types/teams.types";

const DUI_REGEX = /^\d{8}-\d$/;

function calculateAge(birthDate: string): number {
  const [year, month, day] = birthDate.split("-").map(Number);

  if (!year || !month || !day) return -1;

  const birth = new Date(year, month - 1, day);

  // Rechaza fechas inexistentes, como 31 de febrero.
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day
  ) {
    return -1;
  }

  const today = new Date();

  let age = today.getFullYear() - year;

  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day)
  ) {
    age--;
  }

  return age;
}

const VALID_POSITIONS: PlayerPosition[] = [
  "PORTERO",
  "DEFENSA",
  "MEDIOCAMPISTA",
  "DELANTERO",
];

export function useTeamRegistration() {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [players, setPlayers] = useState<PlayerDraft[]>([]);

  const mutation = useCreateTeamMutation();

  const normalizedName = name.trim().replace(/\s+/g, " ");
  const normalizedShortName = shortName.trim().toUpperCase();

  const validate = (): string | null => {
    if (normalizedName.length < 3 || normalizedName.length > 80) {
      return "El nombre debe tener entre 3 y 80 caracteres.";
    }

    if (
      normalizedShortName.length < 2 ||
      normalizedShortName.length > 12
    ) {
      return "La sigla debe tener entre 2 y 12 caracteres.";
    }

    if (players.length < 5 || players.length > 15) {
      return "Debes registrar entre 5 y 15 jugadores.";
    }

    const duis = players.map((player) => player.dui.trim());
    const numbers = players.map((player) => player.jerseyNumber);

    if (new Set(duis).size !== duis.length) {
      return "Existen jugadores con DUI duplicado.";
    }

    if (new Set(numbers).size !== numbers.length) {
      return "Existen números de camiseta duplicados.";
    }

    for (const player of players) {
      const playerName = player.name.trim().replace(/\s+/g, " ");

      if (playerName.length < 3 || playerName.length > 100) {
        return "Cada jugador debe tener un nombre de entre 3 y 100 caracteres.";
      }

      if (!DUI_REGEX.test(player.dui.trim())) {
        return `El DUI de ${player.name} no tiene un formato válido.`;
      }

      if (calculateAge(player.birthDate) < 18) {
        return `${player.name} debe ser mayor de 18 años y tener una fecha válida.`;
      }

      if (!VALID_POSITIONS.includes(player.position)) {
        return `La posición de ${player.name} no es válida.`;
      }

      const number = Number(player.jerseyNumber);

      if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 99
      ) {
        return `La camiseta de ${player.name} debe estar entre 1 y 99.`;
      }
    }

    return null;
  };

  const submit = async () => {
    const validationError = validate();

    if (validationError) {
      throw new Error(validationError);
    }

    const request: CreateTeamRequest = {
      name: normalizedName,
      shortName: normalizedShortName,
      players: players.map((player) => ({
        name: player.name.trim().replace(/\s+/g, " "),
        dui: player.dui.trim(),
        birthDate: player.birthDate,
        position: player.position,
        jerseyNumber: Number(player.jerseyNumber),
      })),
    };

    return mutation.mutateAsync(request);
  };

  const reset = () => {
    setName("");
    setShortName("");
    setPlayers([]);
    mutation.reset();
  };

  return {
    name,
    shortName,
    players,
    setName,
    setShortName,
    setPlayers,
    submit,
    reset,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    registeredTeam: mutation.data,
  };
}
