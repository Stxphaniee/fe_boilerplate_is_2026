
"use client";

import { Bell, LockKeyhole } from "lucide-react";

import type {
  CourtOption,
  MatchEditData,
  MatchState,
} from "@/types/matches.types";

interface MatchEditFormProps {
  data: MatchEditData;
  date: string;
  time: string;
  court: CourtOption;

  canEdit: boolean;
  canSave: boolean;
  canSuspend: boolean;
  canCancel: boolean;
  isSuspended: boolean;
  isSaving: boolean;

  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onCourtChange: (value: CourtOption) => void;

  onSave: () => void;
  onSuspend: () => void;
  onCancel: () => void;
}

const COURT_LABELS: Record<CourtOption, string> = {
  A: "Cancha A · Sintética",
  B: "Cancha B · Grama natural",
  C: "Cancha C · Techada",
};

function formatStoredDate(value: string): string {
  return new Date(value).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatStoredTime(value: string): string {
  return new Date(value).toLocaleTimeString("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatInputDate(value: string): string {
  if (!value) return "Sin fecha";

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "Sin fecha";

  return `${day}/${month}/${year}`;
}

function getLockedMessage(state: MatchState): string {
  switch (state) {
    case "EN_CURSO":
      return "Este partido ya está EN_CURSO y no admite modificaciones.";

    case "FINALIZADO":
      return "Este partido ya está FINALIZADO y no admite modificaciones.";

    case "CANCELADO":
      return "Este partido está CANCELADO y no admite nuevas modificaciones.";

    default:
      return "Este partido no se encuentra disponible para edición.";
  }
}

export function MatchEditForm({
  data,
  date,
  time,
  court,
  canEdit,
  canSave,
  canSuspend,
  canCancel,
  isSuspended,
  isSaving,
  onDateChange,
  onTimeChange,
  onCourtChange,
  onSave,
  onSuspend,
  onCancel,
}: MatchEditFormProps) {
  const { match } = data;

  const beforeDate = formatStoredDate(match.fechaHoraInicio);
  const beforeTime = formatStoredTime(match.fechaHoraInicio);

  const afterDate = formatInputDate(date);
  const afterTime = time || "Sin hora";

  const originalDate = new Date(match.fechaHoraInicio);

  const originalDateInput = [
    originalDate.getFullYear(),
    String(originalDate.getMonth() + 1).padStart(2, "0"),
    String(originalDate.getDate()).padStart(2, "0"),
  ].join("-");

  const hasPreviewChanges =
    date !== originalDateInput ||
    time !== beforeTime ||
    court !== match.cancha;

  return (
    <div className="space-y-4">

      {/* Formulario principal */}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
        <div className="border-b border-[#d8e3f0] bg-[#eaf3ff] px-4 py-3">
          <h2 className="text-sm font-bold text-[#1a2b4a]">
            Editar partido
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-4 md:grid-cols-2 md:p-5">

          {/* Encuentro */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]">
              Encuentro
            </label>

            <input
              type="text"
              readOnly
              value={`${data.equipoLocalNombre} vs ${data.equipoVisitanteNombre}`}
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-[#f8fafc] px-3 text-xs text-[#243858] outline-none"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]">
              Estado actual
            </label>

            <input
              type="text"
              readOnly
              value={match.estado}
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-[#f8fafc] px-3 text-xs text-[#243858] outline-none"
            />
          </div>

          {/* Fecha */}
          <div>
            <label
              htmlFor="match-new-date"
              className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]"
            >
              {isSuspended ? "Nueva fecha *" : "Fecha nueva *"}
            </label>

            <input
              id="match-new-date"
              type="date"
              required
              value={date}
              disabled={!canEdit || isSaving}
              onChange={(event) => onDateChange(event.target.value)}
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-white px-3 text-xs text-[#243858] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-[#1457c5]/10 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-gray-400"
            />
          </div>

          {/* Hora */}
          <div>
            <label
              htmlFor="match-new-time"
              className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]"
            >
              Hora nueva *
            </label>

            <input
              id="match-new-time"
              type="time"
              required
              value={time}
              disabled={!canEdit || isSaving}
              onChange={(event) => onTimeChange(event.target.value)}
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-white px-3 text-xs text-[#243858] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-[#1457c5]/10 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-gray-400"
            />
          </div>

          {/* Cancha */}
          <div>
            <label
              htmlFor="match-new-court"
              className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]"
            >
              Cancha nueva *
            </label>

            <select
              id="match-new-court"
              value={court}
              disabled={!canEdit || isSaving}
              onChange={(event) =>
                onCourtChange(event.target.value as CourtOption)
              }
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-white px-3 text-xs text-[#243858] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-[#1457c5]/10 disabled:cursor-not-allowed disabled:bg-[#f8fafc] disabled:text-gray-400"
            >
              {(Object.keys(COURT_LABELS) as CourtOption[]).map((option) => (
                <option key={option} value={option}>
                  {COURT_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          {/* Árbitro */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#1a2b4a]">
              Árbitro asignado
            </label>

            <input
              type="text"
              readOnly
              value={data.arbitroNombre}
              className="h-10 w-full rounded-md border border-[#cbd8e8] bg-[#f8fafc] px-3 text-xs text-[#243858] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Aviso de reglas */}
      <section
        className={`flex gap-3 rounded-xl px-4 py-4 ${
          canEdit
            ? "bg-[#eaf3ff] text-[#1a2b4a]"
            : "border border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        {canEdit ? (
          <Bell className="mt-0.5 shrink-0 text-[#1457c5]" size={18} />
        ) : (
          <LockKeyhole className="mt-0.5 shrink-0" size={18} />
        )}

        <div>
          <h3 className="text-xs font-bold">
            {canEdit ? "Requiere confirmación" : "Partido no editable"}
          </h3>

          <p className="mt-1.5 text-xs leading-5">
            {canEdit
              ? isSuspended
                ? "El partido está suspendido. Al reprogramarlo volverá al estado PROGRAMADO. Debes indicar una nueva fecha y hora."
                : "Se notificará el cambio a los equipos y al árbitro. No se modifican partidos EN_CURSO ni FINALIZADOS."
              : getLockedMessage(match.estado)}
          </p>
        </div>
      </section>

      {/* Vista previa */}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
        <div className="border-b border-[#d8e3f0] bg-[#eaf3ff] px-4 py-3">
          <h2 className="text-sm font-bold text-[#1a2b4a]">
            Vista previa de cambios
          </h2>
        </div>

        <div className="space-y-2.5 px-4 py-4 text-xs">
          <p className="font-semibold text-[#1a2b4a]">
            ANTES · {beforeDate} a las {beforeTime} ·{" "}
            {COURT_LABELS[match.cancha]}
          </p>

          <p className="text-[#7184a3]">
            DESPUÉS · {afterDate} a las {afterTime} ·{" "}
            {COURT_LABELS[court]}
          </p>

          <p className="pt-1 text-[11px] text-[#7184a3]">
            {isSuspended
              ? "La reprogramación devolverá el partido al estado PROGRAMADO."
              : "Suspensión: debes indicar un motivo de máximo 250 caracteres."}
          </p>

          {hasPreviewChanges && canEdit && (
            <p className="font-medium text-[#1457c5]">
              Hay cambios pendientes de guardar.
            </p>
          )}
        </div>
      </section>

      {/* Acciones */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="min-h-10 rounded-lg bg-[#e43d4d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#c92f3e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar partido
          </button>
        )}

        {canSuspend && (
          <button
            type="button"
            onClick={onSuspend}
            disabled={isSaving}
            className="min-h-10 rounded-lg border border-[#b9cbe2] bg-white px-4 py-2.5 text-xs font-semibold text-[#1a2b4a] transition hover:bg-[#f3f7fc] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suspender partido
          </button>
        )}

        {canEdit && (
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="min-h-10 rounded-lg bg-[#1457c5] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1049a8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Guardando..."
              : isSuspended
                ? "Reprogramar partido"
                : "Guardar cambios"}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pb-2 text-[10px] text-[#7184a3]">
        <span>/admin/partidos/{match.id}/editar</span>
        <span>HU5 / 23</span>
      </div>
    </div>
  );
}
