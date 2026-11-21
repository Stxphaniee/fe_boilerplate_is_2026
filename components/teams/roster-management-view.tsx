"use client";

import { useState } from "react";
import { useMyTeamQuery, useTeamPlayersQuery } from "@/queries/teams/teams.queries";
import { useAddPlayerMutation, useRemovePlayerMutation } from "@/queries/teams/teams.mutations";
import { PlayerRosterH3 } from "./player-roster-h3";
import { AddPlayerModal } from "./add-player-modal";
import { RemovePlayerModal } from "./remove-player-modal";
import type { AddPlayerRequest, PlayerResponse } from "@/types/teams.types";

export function RosterManagementView() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<PlayerResponse | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: team, isLoading: isLoadingTeam } = useMyTeamQuery();

  const {
    data: players = [],
    isLoading: isLoadingPlayers,
  } = useTeamPlayersQuery(team?.id ?? "", !!team?.id);

  const addMutation = useAddPlayerMutation(team?.id ?? "");
  const removeMutation = useRemovePlayerMutation(team?.id ?? "");

  const activePlayers = players.filter((p) => !p.leftAt);
  const freeSlotsCount = 15 - activePlayers.length;

  function clearMessages() {
    setErrorMessage(null);
    setSuccessMessage(null);
  }

  async function handleAddPlayer(data: AddPlayerRequest) {
    clearMessages();
    try {
      await addMutation.mutateAsync(data);
      setShowAddModal(false);
      setSuccessMessage("Jugador agregado correctamente.");
    } catch {
      setErrorMessage("No se pudo agregar el jugador. Verifica los datos e intenta de nuevo.");
    }
  }

  async function handleRemovePlayer() {
    if (!playerToRemove) return;
    clearMessages();
    setRemovingId(playerToRemove.id);
    try {
      await removeMutation.mutateAsync(playerToRemove.id);
      setPlayerToRemove(null);
      setSuccessMessage("Jugador dado de baja correctamente.");
    } catch {
      setErrorMessage("No se pudo dar de baja al jugador. Intenta de nuevo.");
    } finally {
      setRemovingId(null);
    }
  }

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-sm">Cargando equipo...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-sm">No tienes un equipo inscrito.</p>
      </div>
    );
  }

  if (team.status !== "APROBADO") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500 text-sm">
          Solo puedes gestionar la plantilla de un equipo aprobado.
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
            Altas y bajas de jugadores
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona jugadores activos sin perder el historial de partidos.
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#e8edf5] text-[#1a2b4a]">
            Capitán
          </span>
          <p className="text-xs text-gray-400 mt-1">Liga Mayor Amateur · 2026</p>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Equipo</p>
          <p className="text-xl font-bold text-[#1a2b4a]">{team.name}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Estado</p>
          <p className="text-xl font-bold text-[#1a2b4a]">{team.status}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Activos</p>
          <p className="text-xl font-bold text-[#1a2b4a]">
            {String(activePlayers.length).padStart(2, "0")}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 border-l-4 border-l-yellow-400">
          <p className="text-xs text-gray-500 mb-1">Cupos libres</p>
          <p className="text-xl font-bold text-yellow-500">{freeSlotsCount}</p>
        </div>
      </div>

      {/* Mensajes de feedback */}
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

      {/* Tabla de plantilla */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-[#1a2b4a] mb-4">
          Plantilla actual
        </h2>

        {isLoadingPlayers ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            Cargando plantilla...
          </p>
        ) : (
          <PlayerRosterH3
            players={activePlayers}
            onRemove={(player) => {
              clearMessages();
              setPlayerToRemove(player);
            }}
            isRemoving={removeMutation.isPending}
            removingId={removingId}
          />
        )}
      </div>

      {/* Banner ventana de altas y bajas */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6">
        <span className="text-blue-500 text-lg mt-0.5">🔔</span>
        <div>
          <p className="text-sm font-semibold text-blue-800">
            Ventana de altas y bajas
          </p>
          <p className="text-xs text-blue-600 mt-0.5">
            16 de noviembre al 15 de diciembre · No se permite menos de 5 ni
            más de 15 activos.
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            clearMessages();
            setPlayerToRemove(players.find((p) => !p.leftAt) ?? null);
          }}
          className="px-5 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Dar de baja
        </button>
        <button
          onClick={() => {
            clearMessages();
            setShowAddModal(true);
          }}
          disabled={freeSlotsCount === 0}
          className="px-5 py-2.5 text-sm rounded-lg bg-[#1a2b4a] text-white hover:bg-[#243860] disabled:opacity-50"
        >
          Agregar jugador
        </button>
      </div>

      {/* Modales */}
      {showAddModal && (
        <AddPlayerModal
          onConfirm={handleAddPlayer}
          onCancel={() => setShowAddModal(false)}
          isLoading={addMutation.isPending}
        />
      )}

      {playerToRemove && (
        <RemovePlayerModal
          playerName={playerToRemove.name}
          onConfirm={handleRemovePlayer}
          onCancel={() => setPlayerToRemove(null)}
          isLoading={removeMutation.isPending}
        />
      )}
    </div>
  );
}