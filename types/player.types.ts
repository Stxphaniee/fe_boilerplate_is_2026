import type { PlayerPosition } from "@/types/teams.types";

export type { PlayerPosition };

export type PlayerDraft = {
  id: string;
  name: string;
  dui: string;
  birthDate: string;
  position: PlayerPosition;
  jerseyNumber: number | "";
};

export const PLAYER_POSITIONS: {
  value: PlayerPosition;
  label: string;
}[] = [
  { value: "PORTERO", label: "Portero" },
  { value: "DEFENSA", label: "Defensa" },
  { value: "MEDIOCAMPISTA", label: "Mediocampista" },
  { value: "DELANTERO", label: "Delantero" },
];

export function calculateAge(birthDate: string): number {
  if (!birthDate) return -1;

  const [year, month, day] = birthDate.split("-").map(Number);

  if (!year || !month || !day) return -1;

  const birth = new Date(year, month - 1, day);

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
