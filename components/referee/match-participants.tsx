import {
  Check,
  CircleDot,
  Footprints,
  Users,
} from "lucide-react";

import type {
  MatchEventType,
  RefereePanel,
} from "@/types/referee.types";

const EVENT_LABELS: Record<MatchEventType, string> = {
  GOL: "Gol",
  ASISTENCIA: "Asistencia",
  AMARILLA: "Tarjeta amarilla",
  ROJA: "Tarjeta roja",
};

const POSITION_LABELS = {
  PORTERO: "Portero",
  DEFENSA: "Defensa",
  MEDIOCAMPISTA: "Mediocampista",
  DELANTERO: "Delantero",
} as const;

function EventIcon({
  type,
}: {
  type: MatchEventType;
}) {
  if (type === "AMARILLA") {
    return (
      <span
        aria-hidden="true"
        className="h-4 w-3 shrink-0 rounded-sm bg-yellow-400"
      />
    );
  }

  if (type === "ROJA") {
    return (
      <span
        aria-hidden="true"
        className="h-4 w-3 shrink-0 rounded-sm bg-red-500"
      />
    );
  }

  if (type === "ASISTENCIA") {
    return (
      <Footprints
        size={15}
        className="shrink-0 text-[#1457c5]"
      />
    );
  }

  return (
    <CircleDot
      size={15}
      className="shrink-0 text-emerald-600"
    />
  );
}

interface MatchParticipantsProps {
  panel: RefereePanel;

  draft: Record<string, boolean>;

  disabled: boolean;
  hasChanges: boolean;
  isSaving: boolean;

  onChange: (
    playerId: string,
    checked: boolean,
  ) => void;

  onSave: () => void;
}

export function MatchParticipants({
  panel,
  draft,
  disabled,
  hasChanges,
  isSaving,
  onChange,
  onSave,
}: MatchParticipantsProps) {
  const savedCount = panel.jugadores.filter(
    (player) => player.participo,
  ).length;

  const selectedCount = panel.jugadores.filter(
    (player) =>
      draft[player.id] ??
      player.participo,
  ).length;

  return (
    <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
      <header className="border-b border-[#d8e3f0] bg-[#eaf3ff] px-5 py-3">
        <h2 className="text-sm font-bold text-[#172b4d]">
          Incidencias y participación
        </h2>
      </header>

      <div className="space-y-5 p-5">

        {/* Incidencias registradas */}
        <div>
          <h3 className="mb-3 text-xs font-bold text-[#172b4d]">
            Historial de incidencias
          </h3>

          {panel.eventos.length === 0 ? (
            <p className="rounded-lg bg-[#f5f8fc] p-3 text-xs text-[#7184a3]">
              Todavía no hay incidencias
              registradas.
            </p>
          ) : (
            <div className="max-h-[220px] space-y-1 overflow-y-auto pr-1">
              {panel.eventos.map((event) => {
                const teamName =
                  event.equipoId ===
                  panel.equipoLocal.id
                    ? panel.equipoLocal.nombre
                    : panel.equipoVisitante.nombre;

                return (
                  <article
                    key={event.id}
                    className="flex items-start gap-3 border-b border-[#e5edf6] py-3 last:border-0"
                  >
                    <div className="min-w-9 text-xs font-bold tabular-nums text-[#1457c5]">
                      {event.minuto}&apos;
                    </div>

                    <EventIcon type={event.tipo} />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#172b4d]">
                        {EVENT_LABELS[event.tipo]}
                        {" · "}
                        {event.jugador}
                      </p>

                      <p className="mt-1 text-[10px] text-[#7184a3]">
                        {teamName}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Participantes */}
        <div className="border-t border-[#e5edf6] pt-4">
          <div className="mb-3 flex items-center gap-2">
            <Users
              size={17}
              className="text-[#1457c5]"
            />

            <h3 className="text-xs font-bold text-[#172b4d]">
              {savedCount} participantes guardados
            </h3>
          </div>

          <p className="mb-4 text-[11px] leading-5 text-[#7184a3]">
            Marca a todos los jugadores que
            participaron, incluso si no
            registraron goles ni tarjetas.
          </p>

          <div className="max-h-[310px] space-y-4 overflow-y-auto pr-2">
            {[
              panel.equipoLocal,
              panel.equipoVisitante,
            ].map((team) => {
              const players =
                panel.jugadores.filter(
                  (player) =>
                    player.equipoId === team.id,
                );

              return (
                <div key={team.id}>
                  <h4 className="mb-2 rounded-md bg-[#f3f7fc] px-3 py-2 text-xs font-semibold text-[#243858]">
                    {team.nombre}
                  </h4>

                  {players.length === 0 && (
                    <p className="p-3 text-xs text-[#7184a3]">
                      No hay jugadores disponibles.
                    </p>
                  )}

                  {players.map((player) => (
                    <label
                      key={player.id}
                      className="flex items-center gap-3 border-b border-[#e5edf6] px-2 py-3 last:border-0"
                    >
                      <input
                        type="checkbox"
                        checked={
                          draft[player.id] ??
                          player.participo
                        }
                        disabled={
                          disabled ||
                          !player.activo
                        }
                        onChange={(event) =>
                          onChange(
                            player.id,
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 shrink-0 accent-[#1457c5] disabled:cursor-not-allowed"
                      />

                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#eaf3ff] text-[10px] font-bold text-[#1457c5]">
                        {player.dorsal}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#172b4d]">
                          {player.nombre}
                        </p>

                        <p className="mt-1 text-[10px] text-[#7184a3]">
                          {POSITION_LABELS[
                            player.posicion
                          ]}

                          {!player.activo &&
                            " · Inactivo"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#7184a3]">
              {selectedCount} seleccionados

              {hasChanges &&
                " · Sin guardar"}
            </span>

            <button
              type="button"
              onClick={onSave}
              disabled={
                disabled ||
                !hasChanges ||
                isSaving
              }
              className="inline-flex items-center gap-2 rounded-lg border border-[#b9cbe2] bg-white px-3 py-2.5 text-xs font-semibold text-[#1457c5] transition hover:bg-[#eaf3ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={14} />

              {isSaving
                ? "Guardando..."
                : "Guardar participantes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}