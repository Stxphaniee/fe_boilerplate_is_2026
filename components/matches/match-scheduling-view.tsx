"use client";

import { useState } from "react";

import {
  useRoundsQuery,
  useAvailableTeamsQuery,
  useRefereesQuery,
  useRoundMatchesQuery,
} from "@/queries/matches/matches.queries";

import {
  useCreateMatchMutation,
  useCreateRoundMutation,
  usePublishRoundMutation,
} from "@/queries/matches/matches.mutations";

import { MatchScheduleForm } from "./match-schedule-form";
import { RoundMatchesTable } from "./round-matches-table";

import { getErrorMessage } from "@/lib/api/errors";

import type {
  CreateMatchRequest,
} from "@/types/matches.types";

export function MatchSchedulingView() {
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consultar jornadas.
  const {
    data: rounds = [],
    isLoading: isLoadingRounds,
  } = useRoundsQuery();

  // Consultar equipos disponibles.
  const {
    data: teams = [],
    isLoading: isLoadingTeams,
    isError: isTeamsError,
  } = useAvailableTeamsQuery();

  // Consultar árbitros.
  const {
    data: referees = [],
    isLoading: isLoadingReferees,
    isError: isRefereesError,
  } = useRefereesQuery();

  // Mutaciones.
  const createMatchMutation = useCreateMatchMutation();
  const createRoundMutation = useCreateRoundMutation();
  const publishRoundMutation = usePublishRoundMutation();

  // Determinar jornada seleccionada.
  const selectedRound =
    rounds.find((r) => r.id === selectedRoundId) ??
    rounds.find((r) => r.state === "BORRADOR") ??
    null;

  // Consultar partidos de la jornada seleccionada.
  const {
    data: currentMatches = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
  } = useRoundMatchesQuery(
    selectedRound?.id ?? "",
    !!selectedRound?.id,
  );

  // Mapas para mostrar nombres en la tabla.
  const teamNames = Object.fromEntries(
    teams.map((team) => [team.id, team.name]),
  );

  const refereeNames = Object.fromEntries(
    referees.map((referee) => [
      referee.id,
      referee.name || referee.email,
    ]),
  );

  function clearMessages() {
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  // Crear partido.
  async function handleCreateMatch(data: CreateMatchRequest) {
    clearMessages();

    try {
      await createMatchMutation.mutateAsync(data);

      setSelectedRoundId(data.jornadaId);

      setSuccessMessage(
        "Partido programado correctamente.",
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Crear jornada.
  async function handleCreateRound() {
    clearMessages();

    const nextNumero =
      rounds.reduce(
        (max, round) => Math.max(max, round.numero),
        0,
      ) + 1;

    try {
      const round = await createRoundMutation.mutateAsync({
        numero: nextNumero,
      });

      setSelectedRoundId(round.id);

      setSuccessMessage(
        `Jornada ${nextNumero} creada en borrador.`,
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Publicar jornada.
  async function handlePublishRound() {
    if (!selectedRound) return;

    clearMessages();

    try {
      await publishRoundMutation.mutateAsync(
        selectedRound.id,
      );

      setSuccessMessage(
        "Jornada publicada correctamente.",
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  if (isLoadingRounds) {
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Cargando información de jornadas...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2b4a]">
            Programación manual de partidos
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Programa jornadas, horarios, canchas y árbitros sin traslapes.
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e8edf5] text-[#1a2b4a]">
            Organizador
          </span>

          <p className="text-xs text-gray-400 mt-1">
            Liga Mayor Amateur · 2026
          </p>
        </div>
      </div>

      {/* Selector de jornada */}
      <div className="flex items-center gap-3 mb-6">

        <div className="flex-1">
          <select
            value={selectedRound?.id ?? ""}
            onChange={(e) =>
              setSelectedRoundId(e.target.value || null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">
              Seleccionar jornada
            </option>

            {rounds.map((r) => (
              <option key={r.id} value={r.id}>
                Jornada {String(r.numero).padStart(2, "0")} —{" "}
                {r.state === "BORRADOR" ? "Borrador" : "Publicada"}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleCreateRound}
          disabled={createRoundMutation.isPending}
          className="px-4 py-2 text-sm rounded-lg border border-[#1a2b4a] text-[#1a2b4a] hover:bg-[#e8edf5] disabled:opacity-50"
        >
          {createRoundMutation.isPending
            ? "Creando..."
            : "+ Nueva jornada"}
        </button>
      </div>

      {/* Mensajes */}
      {successMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Errores de consultas */}
      {(isTeamsError || isRefereesError) && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          No fue posible cargar los equipos o árbitros. Verifica las consultas del servidor.
        </div>
      )}

      {/* Formulario */}
      {isLoadingTeams || isLoadingReferees ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500 text-center py-4">
            Cargando equipos y árbitros...
          </p>
        </div>
      ) : (
        <MatchScheduleForm
          rounds={rounds}
          teams={teams}
          referees={referees}
          onSubmit={handleCreateMatch}
          isLoading={createMatchMutation.isPending}
        />
      )}

      {/* Tabla de partidos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">

        <h2 className="text-base font-semibold text-[#1a2b4a] mb-4">
          Partidos de la jornada

          {selectedRound && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              — Jornada {String(selectedRound.numero).padStart(2, "0")}
            </span>
          )}
        </h2>

        {isLoadingMatches ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Cargando partidos...
          </p>
        ) : isMatchesError ? (
          <p className="text-sm text-red-500 text-center py-4">
            No fue posible consultar los partidos de esta jornada.
          </p>
        ) : (
          <RoundMatchesTable
            matches={currentMatches}
            refereeNames={refereeNames}
            teamNames={teamNames}
          />
        )}

      </div>

      {/* Publicar jornada */}
      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={handlePublishRound}
          disabled={
            !selectedRound ||
            selectedRound.state !== "BORRADOR" ||
            publishRoundMutation.isPending
          }
          className="px-5 py-2.5 text-sm rounded-lg bg-[#1a2b4a] text-white hover:bg-[#243860] disabled:opacity-50"
        >
          {publishRoundMutation.isPending
            ? "Publicando..."
            : "Publicar jornada"}
        </button>

      </div>

    </div>
  );
}