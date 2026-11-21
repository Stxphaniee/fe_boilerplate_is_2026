
"use client";

import type { PlayerDraft } from "@/types/player.types";
import { PlayerRoster } from "./player-roster";
import { RosterRequirements } from "./roster-requirements";

interface TeamCorrectionFormProps {
  name: string;
  setName: (value: string) => void;
  players: PlayerDraft[];
  setPlayers: (players: PlayerDraft[]) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function TeamCorrectionForm({
  name,
  setName,
  players,
  setPlayers,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: TeamCorrectionFormProps) {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSubmit();
      }}
      className="space-y-5"
    >
      <section className="rounded-xl border border-[#d8e3f0] bg-white p-6">
        <h2 className="text-lg font-bold text-[#172b4d]">
          Corregir inscripción
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Actualiza la información solicitada por el
          organizador y vuelve a enviar tu inscripción.
        </p>

        <label
          htmlFor="correction-team-name"
          className="mt-6 block text-sm font-semibold text-[#172b4d]"
        >
          Nombre del equipo
        </label>

        <input
          id="correction-team-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
          className="mt-2 w-full rounded-lg border border-[#d8e3f0] px-4 py-3 text-sm text-[#172b4d] outline-none focus:border-blue-600"
        />
      </section>

      <PlayerRoster
        players={players}
        setPlayers={setPlayers}
      />

      <RosterRequirements />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-[#b8c9df] bg-white px-6 py-3 text-sm font-semibold text-[#294b7d] disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#1457c5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1049a8] disabled:opacity-50"
        >
          {isSubmitting
            ? "Reenviando..."
            : "Guardar y reenviar inscripción"}
        </button>
      </div>
    </form>
  );
}
