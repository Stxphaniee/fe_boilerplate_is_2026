"use client";

import type { PlayerResponse } from "@/types/teams.types";

const POSITION_LABEL: Record<string, string> = {
  PORTERO: "Portero",
  DEFENSA: "Defensa",
  MEDIOCAMPISTA: "Mediocampista",
  DELANTERO: "Delantero",
};

interface PlayerRosterH3Props {
  players: PlayerResponse[];
  onRemove: (player: PlayerResponse) => void;
  isRemoving: boolean;
  removingId: string | null;
}

export function PlayerRosterH3({
  players,
  onRemove,
  isRemoving,
  removingId,
}: PlayerRosterH3Props) {
  if (players.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4 text-center">
        No hay jugadores activos en la plantilla.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              Nombre completo
            </th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              DUI
            </th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              Posición
            </th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              Camiseta
            </th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              Estado
            </th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 font-semibold text-[#1a2b4a]">
                {player.name}
              </td>
              <td className="py-3 px-4 text-gray-600">{player.dui}</td>
              <td className="py-3 px-4 text-gray-600">
                {POSITION_LABEL[player.position] ?? player.position}
              </td>
              <td className="py-3 px-4 text-gray-600">{player.jerseyNumber}</td>
              <td className="py-3 px-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-700">
                  APROBADO
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onRemove(player)}
                  disabled={isRemoving && removingId === player.id}
                  className="text-sm text-gray-500 hover:text-red-600 disabled:opacity-40"
                >
                  {isRemoving && removingId === player.id
                    ? "Procesando..."
                    : "Dar de baja"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}