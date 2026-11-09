
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamRegistration } from "@/hooks/use-team-registration";
import { TeamInformation } from "./team-information";
import { PlayerRoster } from "./player-roster";
import { RosterRequirements } from "./roster-requirements";

export function TeamRegistrationForm() {
  const router = useRouter();

  const {
    name,
    shortName,
    players,
    setName,
    setShortName,
    setPlayers,
    submit,
    reset,
    isPending,
    isSuccess,
    error,
    registeredTeam,
  } = useTeamRegistration();

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setValidationError("");

    try {
      await submit();
      router.push("/mi-equipo");
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al inscribir el equipo.",
      );
    }
  };

  if (isSuccess && registeredTeam) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-green-200 bg-white p-8 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
            ✓
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#172b4d]">
              ¡Equipo inscrito correctamente!
            </h2>
            <p className="text-sm text-[#7184a3]">
              Tu solicitud ha sido enviada.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-[#f5f8fc] p-5 text-sm text-[#172b4d]">
          <p>
            <strong>Equipo:</strong> {registeredTeam.name}
          </p>
          <p>
            <strong>Sigla:</strong> {registeredTeam.shortName}
          </p>
          <p>
            <strong>Jugadores:</strong> {registeredTeam.players.length}
          </p>
          <p>
            <strong>Estado:</strong> {registeredTeam.status}
          </p>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TeamInformation
        name={name}
        shortName={shortName}
        setName={setName}
        setShortName={setShortName}
      />

      <PlayerRoster
        players={players}
        setPlayers={setPlayers}
      />

      <RosterRequirements />

      {validationError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {validationError}
        </div>
      )}

      {error && !validationError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error.message}
        </div>
      )}

      <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            reset();
            setValidationError("");
          }}
          disabled={isPending}
          className="rounded-md border border-[#b8c9df] bg-white px-6 py-3 text-sm font-semibold text-[#294b7d] transition hover:bg-[#f3f7fc] disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-[#1457c5] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1049a8] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Enviando inscripción..."
            : "Guardar y enviar inscripción"}
        </button>
      </div>

      <p className="text-right text-xs text-[#7184a3]">
        {players.length} jugadores registrados de 5 a 15 requeridos.
      </p>
    </form>
  );
}
