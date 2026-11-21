"use client";

import { useState } from "react";
import type { AddPlayerRequest, PlayerPosition } from "@/types/teams.types";

interface AddPlayerModalProps {
  onConfirm: (data: AddPlayerRequest) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const POSITIONS: { value: PlayerPosition; label: string }[] = [
  { value: "PORTERO", label: "Portero" },
  { value: "DEFENSA", label: "Defensa" },
  { value: "MEDIOCAMPISTA", label: "Mediocampista" },
  { value: "DELANTERO", label: "Delantero" },
];

const DUI_REGEX = /^\d{8}-\d$/;

function getAge(birthDate: string): number {
  const birth = new Date(`${birthDate}T00:00:00.000Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const notReached =
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() &&
      now.getUTCDate() < birth.getUTCDate());
  if (notReached) age--;
  return age;
}

export function AddPlayerModal({
  onConfirm,
  onCancel,
  isLoading,
}: AddPlayerModalProps) {
  const [form, setForm] = useState<AddPlayerRequest>({
    name: "",
    dui: "",
    birthDate: "",
    position: "PORTERO",
    jerseyNumber: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AddPlayerRequest, string>>>({});

  function validate(): boolean {
    const next: Partial<Record<keyof AddPlayerRequest, string>> = {};

    if (!form.name.trim() || form.name.trim().length < 3) {
      next.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!DUI_REGEX.test(form.dui)) {
      next.dui = "El DUI debe tener el formato 00000000-0.";
    }

    if (!form.birthDate) {
      next.birthDate = "La fecha de nacimiento es obligatoria.";
    } else if (getAge(form.birthDate) < 18) {
      next.birthDate = "El jugador debe tener al menos 18 años.";
    }

    if (form.jerseyNumber < 1 || form.jerseyNumber > 99) {
      next.jerseyNumber = "El número de camiseta debe estar entre 1 y 99.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (validate()) onConfirm(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-[#1a2b4a] mb-4">
          Agregar jugador
        </h2>

        <div className="flex flex-col gap-3">
          {/* Nombre */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b4a]"
              placeholder="Carlos Alberto Ruiz Gómez"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* DUI */}
          <div>
            <label className="text-sm font-medium text-gray-700">DUI</label>
            <input
              type="text"
              value={form.dui}
              onChange={(e) => setForm({ ...form, dui: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b4a]"
              placeholder="00000000-0"
            />
            {errors.dui && (
              <p className="text-xs text-red-500 mt-1">{errors.dui}</p>
            )}
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b4a]"
            />
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>
            )}
          </div>

          {/* Posición */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Posición
            </label>
            <select
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value as PlayerPosition })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b4a]"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Número de camiseta */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Número de camiseta
            </label>
            <input
              type="number"
              min={1}
              max={99}
              value={form.jerseyNumber}
              onChange={(e) =>
                setForm({ ...form, jerseyNumber: Number(e.target.value) })
              }
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2b4a]"
            />
            {errors.jerseyNumber && (
              <p className="text-xs text-red-500 mt-1">{errors.jerseyNumber}</p>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg bg-[#1a2b4a] text-white hover:bg-[#243860] disabled:opacity-50"
          >
            {isLoading ? "Guardando..." : "Agregar jugador"}
          </button>
        </div>
      </div>
    </div>
  );
}