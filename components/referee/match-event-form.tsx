"use client";

import type { FormEvent } from "react";

import type {
  MatchEventFormData,
  MatchEventType,
  MatchLiveEvent,
  RefereePlayer,
  RefereeTeam,
} from "@/types/referee.types";

interface MatchEventFormProps {
  form: MatchEventFormData;

  players: RefereePlayer[];

  homeTeam: RefereeTeam;
  awayTeam: RefereeTeam;

  availableGoals: MatchLiveEvent[];

  suggestedMinute: number | null;

  disabled: boolean;

  onChange: <
    K extends keyof MatchEventFormData,
  >(
    field: K,
    value: MatchEventFormData[K],
  ) => void;

  onSubmit: () => void;
}

const EVENT_OPTIONS: {
  value: MatchEventType;
  label: string;
}[] = [
  { value: "GOL", label: "Gol" },
  { value: "ASISTENCIA", label: "Asistencia" },
  { value: "AMARILLA", label: "Tarjeta amarilla" },
  { value: "ROJA", label: "Tarjeta roja" },
];

const INPUT_CLASS =
  "h-11 w-full rounded-md border border-[#cbd8e8] bg-white px-3 text-xs text-[#243858] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-[#1457c5]/10 disabled:cursor-not-allowed disabled:bg-[#f5f8fc] disabled:text-gray-400";

const LABEL_CLASS =
  "mb-2 block text-xs font-semibold text-[#172b4d]";

export function MatchEventForm({
  form,
  players,
  homeTeam,
  awayTeam,
  availableGoals,
  suggestedMinute,
  disabled,
  onChange,
  onSubmit,
}: MatchEventFormProps) {
  const isAssist =
    form.tipo === "ASISTENCIA";

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!disabled) {
      onSubmit();
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
      <header className="border-b border-[#d8e3f0] bg-[#eaf3ff] px-4 py-3">
        <h2 className="text-sm font-bold text-[#172b4d]">
          Registrar una incidencia
        </h2>
      </header>

      <form
        id="match-event-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2"
      >

        {/* Tipo de evento */}
        <div>
          <label
            htmlFor="event-type"
            className={LABEL_CLASS}
          >
            Evento *
          </label>

          <select
            id="event-type"
            value={form.tipo}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                "tipo",
                event.target.value as MatchEventType,
              )
            }
            className={INPUT_CLASS}
          >
            {EVENT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Seleccion de jugador */}
        <div>
          <label
            htmlFor="event-player"
            className={LABEL_CLASS}
          >
            Jugador *
          </label>

          <select
            id="event-player"
            value={form.jugadorId}
            required
            disabled={disabled}
            onChange={(event) =>
              onChange(
                "jugadorId",
                event.target.value,
              )
            }
            className={INPUT_CLASS}
          >
            <option value="">
              Selecciona un jugador
            </option>

            {[homeTeam, awayTeam].map((team) => (
              <optgroup
                key={team.id}
                label={team.nombre}
              >
                {players
                  .filter(
                    (player) =>
                      player.equipoId === team.id,
                  )
                  .map((player) => (
                    <option
                      key={player.id}
                      value={player.id}
                    >
                      #{player.dorsal} -{" "}
                      {player.nombre}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Minuto del encuentro */}
        <div>
          <label
            htmlFor="event-minute"
            className={LABEL_CLASS}
          >
            Minuto *
          </label>

          <input
            id="event-minute"
            type="number"
            min={0}
            max={2_147_483_647}
            step={1}
            value={form.minuto}
            required={suggestedMinute === null}
            placeholder={
              suggestedMinute !== null
                ? String(suggestedMinute)
                : "Ej. 67"
            }
            disabled={disabled}
            onChange={(event) =>
              onChange(
                "minuto",
                event.target.value,
              )
            }
            className={INPUT_CLASS}
          />

          <p className="mt-2 text-[11px] leading-4 text-[#7184a3]">
            {suggestedMinute !== null
              ? `Minuto sugerido: ${suggestedMinute}. Si lo dejas vacío, se utilizará este valor.`
              : "Ingresa manualmente el minuto."}
          </p>
        </div>

        {/* Gol relacionado */}
        <div>
          <label
            htmlFor="related-goal"
            className={LABEL_CLASS}
          >
            Gol relacionado {isAssist ? "*" : ""}
          </label>

          <select
            id="related-goal"
            value={form.golRelacionadoId}
            required={isAssist}
            disabled={
              disabled ||
              !isAssist ||
              !form.jugadorId
            }
            onChange={(event) =>
              onChange(
                "golRelacionadoId",
                event.target.value,
              )
            }
            className={INPUT_CLASS}
          >
            <option value="">
              {isAssist
                ? "Selecciona un gol"
                : "Solo para asistencias"}
            </option>

            {availableGoals.map((goal) => (
              <option
                key={goal.id}
                value={goal.id}
              >
                {goal.minuto}&apos; -{" "}
                {goal.jugador}
              </option>
            ))}
          </select>

          {isAssist &&
            form.jugadorId &&
            availableGoals.length === 0 && (
              <p className="mt-2 text-[11px] text-amber-700">
                No hay goles válidos para
                relacionar con este jugador.
              </p>
            )}
        </div>

        {disabled && (
          <p className="text-xs text-[#7184a3] md:col-span-2">
            El registro de incidencias está
            habilitado únicamente durante
            un partido EN_CURSO y cuando no
            hay otra operación pendiente.
          </p>
        )}
      </form>
    </section>
  );
}