"use client";

import { useState } from "react";
import {
  calculateAge,
  PLAYER_POSITIONS,
  type PlayerDraft,
  type PlayerPosition,
} from "@/types/player.types";

type PlayerRosterProps = {
  players: PlayerDraft[];
  setPlayers: (players: PlayerDraft[]) => void;
};

const EMPTY_PLAYER = {
  name: "",
  dui: "",
  birthDate: "",
  position: "PORTERO" as PlayerPosition,
  jerseyNumber: "" as const,
};

export function PlayerRoster({ players, setPlayers }: PlayerRosterProps) {
  const [newPlayer, setNewPlayer] = useState(EMPTY_PLAYER);
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof EMPTY_PLAYER, value: string) => {
    setNewPlayer(
      (previous) =>
        ({
          ...previous,
          [field]: value,
        }) as typeof EMPTY_PLAYER,
    );
  };

  const addPlayer = () => {
    setError("");

    const name = newPlayer.name.trim().replace(/\s+/g, " ");
    if (name.length < 3 || name.length > 100) {
      setError("El nombre debe tener entre 3 y 100 caracteres.");
      return;
    }
    const dui = newPlayer.dui.trim();
    const jerseyNumber = Number(newPlayer.jerseyNumber);

    if (!name || !newPlayer.birthDate || !dui) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (!/^\d{8}-\d$/.test(dui)) {
      setError("El DUI debe tener el formato 00000000-0.");
      return;
    }

    if (players.some((player) => player.dui === dui)) {
      setError("Este DUI ya está registrado en la plantilla.");
      return;
    }

    const age = calculateAge(newPlayer.birthDate);

    if (age < 18) {
      setError(
        "La fecha de nacimiento debe ser válida y el jugador debe ser mayor de 18 años.",
      );
      return;
    }

    if (
      !Number.isInteger(jerseyNumber) ||
      jerseyNumber < 1 ||
      jerseyNumber > 99
    ) {
      setError("La camiseta debe estar entre 1 y 99.");
      return;
    }

    if (players.some((player) => player.jerseyNumber === jerseyNumber)) {
      setError("Este número de camiseta ya está ocupado.");
      return;
    }

    if (players.length >= 15) {
      setError("La plantilla no puede superar los 15 jugadores.");
      return;
    }

    setPlayers([
      ...players,
      {
        ...newPlayer,
        id: crypto.randomUUID(),
        name,
        dui,
        jerseyNumber,
      },
    ]);

    setNewPlayer(EMPTY_PLAYER);
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  return (
    <section
      id="plantilla"
      className="overflow-hidden rounded-lg border border-[#d8e3f0] bg-white"
    >
      <div className="flex items-center justify-between bg-[#eaf3ff] px-5 py-3">
        <h2 className="text-sm font-bold text-[#172b4d]">
          Plantilla de jugadores
        </h2>

        <span className="text-xs font-medium text-[#1457c5]">
          {players.length} / 15 jugadores
        </span>
      </div>

      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[850px] text-left text-xs">
          <thead className="bg-[#f3f7fc] text-[#7184a3]">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Nombre completo</th>
              <th className="px-3 py-3">DUI</th>
              <th className="px-3 py-3">Nacimiento</th>
              <th className="px-3 py-3">Posición</th>
              <th className="px-3 py-3">Camiseta</th>
              <th className="px-3 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.id}
                className="border-b border-[#e1e8f0] text-[#172b4d]"
              >
                <td className="px-3 py-4 font-semibold">{index + 1}</td>
                <td className="px-3 py-4">{player.name}</td>
                <td className="px-3 py-4">{player.dui}</td>
                <td className="px-3 py-4">{player.birthDate}</td>
                <td className="px-3 py-4">
                  {
                    PLAYER_POSITIONS.find(
                      (position) => position.value === player.position,
                    )?.label
                  }
                </td>
                <td className="px-3 py-4">{player.jerseyNumber}</td>
                <td className="px-3 py-4">
                  <button
                    type="button"
                    onClick={() => removePlayer(player.id)}
                    className="font-semibold text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {players.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-10 text-center text-[#7184a3]"
                >
                  Todavía no hay jugadores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#e1e8f0] p-5">
        <h3 className="mb-4 text-sm font-bold text-[#172b4d]">
          Agregar jugador
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Nombre completo *
            </label>
            <input
              value={newPlayer.name}
              onChange={(e) => updateField("name", e.target.value)}
              maxLength={100}
              placeholder="Nombre del jugador"
              className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm outline-none focus:border-[#1457c5]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">DUI *</label>
            <input
              value={newPlayer.dui}
              onChange={(e) => updateField("dui", e.target.value)}
              maxLength={10}
              placeholder="00000000-0"
              className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm outline-none focus:border-[#1457c5]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Fecha de nacimiento *
            </label>
            <input
              type="date"
              value={newPlayer.birthDate}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("birthDate", e.target.value)}
              className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm outline-none focus:border-[#1457c5]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Posición *
            </label>
            <select
              value={newPlayer.position}
              onChange={(e) => updateField("position", e.target.value)}
              className="w-full rounded-md border border-[#cbd7e6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1457c5]"
            >
              {PLAYER_POSITIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium">
              Número de camiseta *
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={newPlayer.jerseyNumber}
              onChange={(e) => updateField("jerseyNumber", e.target.value)}
              placeholder="Ej. 10"
              className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm outline-none focus:border-[#1457c5]"
            />
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-md bg-red-50 p-3 text-xs text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={addPlayer}
          disabled={players.length >= 15}
          className="mt-5 rounded-md bg-[#1457c5] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1049a8] disabled:opacity-50"
        >
          + Agregar jugador
        </button>
      </div>
    </section>
  );
}
