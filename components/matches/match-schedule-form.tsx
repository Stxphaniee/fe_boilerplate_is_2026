"use client";

import { useState } from "react";

import type {
  CourtOption,
  CreateMatchRequest,
  RoundResponse,
  AvailableTeamOption,
  RefereeOption,
} from "@/types/matches.types";

interface MatchScheduleFormProps {
  rounds: RoundResponse[];
  teams: AvailableTeamOption[];
  referees: RefereeOption[];
  onSubmit: (data: CreateMatchRequest) => void;
  isLoading: boolean;
}

const COURT_LABELS: Record<CourtOption, string> = {
  A: "Cancha A · Sintética",
  B: "Cancha B · Grama Natural",
  C: "Cancha C · Techada",
};

export function MatchScheduleForm({
  rounds,
  teams,
  referees,
  onSubmit,
  isLoading,
}: MatchScheduleFormProps) {
  const [jornadaId, setJornadaId] = useState("");
  const [equipoLocalId, setEquipoLocalId] = useState("");
  const [equipoVisitanteId, setEquipoVisitanteId] = useState("");
  const [arbitroId, setArbitroId] = useState("");
  const [cancha, setCancha] = useState<CourtOption>("A");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const draftRounds = rounds.filter(
    (r) => r.state === "BORRADOR",
  );

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!jornadaId) {
      next.jornadaId = "Selecciona una jornada.";
    }

    if (!equipoLocalId) {
      next.equipoLocalId = "Selecciona el equipo local.";
    }

    if (!equipoVisitanteId) {
      next.equipoVisitanteId = "Selecciona el equipo visitante.";
    }

    if (
      equipoLocalId &&
      equipoLocalId === equipoVisitanteId
    ) {
      next.equipoVisitanteId =
        "El equipo visitante debe ser distinto al local.";
    }

    if (!arbitroId) {
      next.arbitroId = "Selecciona un árbitro.";
    }

    if (!fecha) {
      next.fecha = "La fecha es obligatoria.";
    }

    if (!hora) {
      next.hora = "La hora de inicio es obligatoria.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const fechaHoraInicio = `${fecha}T${hora}:00`;

    onSubmit({
      jornadaId,
      equipoLocalId,
      equipoVisitanteId,
      arbitroId,
      cancha,
      fechaHoraInicio,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">

      <h2 className="text-base font-semibold text-[#1a2b4a] mb-5">
        Nuevo encuentro
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Jornada */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Jornada en borrador *
          </label>

          <select
            value={jornadaId}
            onChange={(e) => setJornadaId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Seleccionar jornada</option>

            {draftRounds.map((r) => (
              <option key={r.id} value={r.id}>
                Jornada {String(r.numero).padStart(2, "0")}
              </option>
            ))}
          </select>

          {errors.jornadaId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.jornadaId}
            </p>
          )}
        </div>

        {/* Equipo local */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Equipo local *
          </label>

          <select
            value={equipoLocalId}
            onChange={(e) => setEquipoLocalId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Seleccionar equipo</option>

            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {errors.equipoLocalId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.equipoLocalId}
            </p>
          )}
        </div>

        {/* Equipo visitante */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Equipo visitante *
          </label>

          <select
            value={equipoVisitanteId}
            onChange={(e) => setEquipoVisitanteId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Seleccionar equipo</option>

            {teams
              .filter((t) => t.id !== equipoLocalId)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
          </select>

          {errors.equipoVisitanteId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.equipoVisitanteId}
            </p>
          )}
        </div>

        {/* Cancha */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Cancha *
          </label>

          <select
            value={cancha}
            onChange={(e) =>
              setCancha(e.target.value as CourtOption)
            }
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {(Object.keys(COURT_LABELS) as CourtOption[]).map((c) => (
              <option key={c} value={c}>
                {COURT_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha *
          </label>

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

          {errors.fecha && (
            <p className="text-xs text-red-500 mt-1">
              {errors.fecha}
            </p>
          )}
        </div>

        {/* Hora */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Hora de inicio *
          </label>

          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />

          {errors.hora && (
            <p className="text-xs text-red-500 mt-1">
              {errors.hora}
            </p>
          )}
        </div>

        {/* Árbitro */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Árbitro asignado *
          </label>

          <select
            value={arbitroId}
            onChange={(e) => setArbitroId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Seleccionar árbitro</option>

            {referees.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name || r.email}
              </option>
            ))}
          </select>

          {errors.arbitroId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.arbitroId}
            </p>
          )}
        </div>

      </div>

      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-5 py-2.5 text-sm rounded-lg bg-[#1a2b4a] text-white hover:bg-[#243860] disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar partido"}
        </button>
      </div>

    </div>
  );
}