import {
  Clock,
  Radio,
  ShieldCheck,
} from "lucide-react";

import type {
  RefereePanel,
  MatchClock,
} from "@/types/referee.types";

import type {
  MatchState,
} from "@/types/matches.types";

const STATUS_STYLES: Record<MatchState, string> = {
  PROGRAMADO:
    "bg-blue-50 text-blue-700",

  EN_CURSO:
    "bg-emerald-100 text-emerald-700",

  FINALIZADO:
    "bg-slate-100 text-slate-700",

  SUSPENDIDO:
    "bg-amber-100 text-amber-800",

  CANCELADO:
    "bg-red-100 text-red-700",
};

export function RefereeMatchStatus({
  status,
}: {
  status: MatchState;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold ${STATUS_STYLES[status]}`}
    >
      {status === "EN_CURSO" && (
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
      )}

      {status === "EN_CURSO"
        ? "EN VIVO"
        : status}
    </span>
  );
}

interface MatchScoreboardProps {
  panel: RefereePanel;
  clock: MatchClock;
}

export function MatchScoreboard({
  panel,
  clock,
}: MatchScoreboardProps) {
  const showScore =
    panel.estado !== "SUSPENDIDO" &&
    panel.estado !== "CANCELADO";

  const homeGoals = showScore
    ? panel.equipoLocal.goles
    : "—";

  const awayGoals = showScore
    ? panel.equipoVisitante.goles
    : "—";

  return (
    <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
      <header className="flex items-center justify-between border-b border-[#d8e3f0] bg-[#eaf3ff] px-5 py-3">
        <h2 className="text-sm font-bold text-[#172b4d]">
          Marcador de partido
        </h2>

        <RefereeMatchStatus status={panel.estado} />
      </header>

      <div className="px-4 py-7 md:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">

          {/* Equipo local */}
          <div className="min-w-0 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf3ff] text-[#1457c5] md:h-14 md:w-14">
              <ShieldCheck size={26} />
            </div>

            <h3 className="break-words text-sm font-bold text-[#172b4d] md:text-lg">
              {panel.equipoLocal.nombre}
            </h3>

            <p className="mt-1 text-xs text-[#7184a3]">
              Local
            </p>
          </div>

          {/* Goles y cronometro */}
          <div className="flex flex-col items-center gap-3">
            <div
              aria-label={`Marcador: ${homeGoals} a ${awayGoals}`}
              className="flex items-center gap-3 text-4xl font-extrabold tabular-nums text-[#1457c5] md:gap-5 md:text-6xl"
            >
              <span>{homeGoals}</span>

              <span className="text-[#b9cee8]">
                —
              </span>

              <span>{awayGoals}</span>
            </div>

            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold tabular-nums ${
                clock.isRunning
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-[#f3f7fc] text-[#7184a3]"
              }`}
            >
              {clock.isRunning ? (
                <Radio
                  size={16}
                  className="animate-pulse"
                />
              ) : (
                <Clock size={16} />
              )}

              <span>{clock.display}</span>
            </div>

            <span className="text-[10px] text-[#7184a3]">
              {panel.estado === "FINALIZADO"
                ? "Tiempo transcurrido final"
                : "Tiempo transcurrido"}
            </span>
          </div>

          {/* Equipo visitante */}
          <div className="min-w-0 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eef2f7] text-[#243858] md:h-14 md:w-14">
              <ShieldCheck size={26} />
            </div>

            <h3 className="break-words text-sm font-bold text-[#172b4d] md:text-lg">
              {panel.equipoVisitante.nombre}
            </h3>

            <p className="mt-1 text-xs text-[#7184a3]">
              Visitante
            </p>
          </div>
        </div>

        {/* Barra de progreso del encuentro */}
        <div className="mx-auto mt-7 max-w-xl">
          <div
            role="progressbar"
            aria-label="Tiempo transcurrido respecto a 90 minutos"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clock.progress)}
            className="h-2 overflow-hidden rounded-full bg-[#e5edf6]"
          >
            <div
              className="h-full rounded-full bg-[#1457c5] transition-[width] duration-700"
              style={{
                width: `${clock.progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[10px] text-[#7184a3]">
            <span>0&apos;</span>
            <span>45&apos;</span>
            <span>90&apos;</span>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#7184a3]">
          Jornada{" "}
          {String(panel.jornada).padStart(2, "0")}
          {" · "}
          Cancha {panel.cancha}

          {clock.minute !== null && (
            <>
              {" · "}
              Minuto {clock.minute}
            </>
          )}
        </p>

        {panel.estado === "EN_CURSO" &&
          clock.elapsedSeconds === null && (
            <p className="mt-3 text-center text-xs text-amber-700">
              La hora real de inicio no está
              disponible para este encuentro.
              Registra los minutos manualmente.
            </p>
          )}

        {clock.elapsedSeconds !== null &&
          clock.elapsedSeconds >= 90 * 60 &&
          panel.estado === "EN_CURSO" && (
            <p className="mt-3 text-center text-xs font-medium text-amber-700">
              Se alcanzaron los 90 minutos de
              referencia. El partido continúa
              hasta que el árbitro lo finalice.
            </p>
          )}
      </div>
    </section>
  );
}