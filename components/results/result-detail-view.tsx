
"use client";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CircleDot,
  Footprints,
  RefreshCw,
} from "lucide-react";

import {
  getErrorMessage,
} from "@/lib/api/errors";

import {
  usePublicMatchQuery,
  usePublicResultsQuery,
} from "@/queries/results/results.queries";

import {
  formatResultDateTime,
} from "@/types/results.types";

import type {
  MatchEventType,
} from "@/types/referee.types";

import { ResultsLayout } from "./results-layout";
import { ResultsStats } from "./results-stats";
import { ResultsStatus } from "./results-status";

// =====================================================
// TIPOS DE EVENTOS
// =====================================================

const EVENT_LABELS: Record<MatchEventType, string> = {
  GOL: "Gol",
  ASISTENCIA: "Asistencia",
  AMARILLA: "Tarjeta amarilla",
  ROJA: "Tarjeta roja",
};

// =====================================================
// ICONO SEGUN TIPO DE EVENTO
// =====================================================

function EventIcon({
  type,
}: {
  type: MatchEventType;
}) {
  if (
    type === "AMARILLA" ||
    type === "ROJA"
  ) {
    return (
      <span
        aria-hidden="true"
        className={`h-4 w-3 shrink-0 rounded-sm ${
          type === "AMARILLA"
            ? "bg-yellow-400"
            : "bg-red-500"
        }`}
      />
    );
  }

  if (type === "ASISTENCIA") {
    return (
      <Footprints
        size={16}
        className="shrink-0 text-[#1457c5]"
      />
    );
  }

  return (
    <CircleDot
      size={16}
      className="shrink-0 text-emerald-600"
    />
  );
}

// =====================================================
// DETALLE PUBLICO DEL PARTIDO
// =====================================================

export function ResultDetailView({
  matchId,
}: {
  matchId: string;
}) {
  const list = usePublicResultsQuery();

  const detail = usePublicMatchQuery(matchId);

  const match = detail.data;

  const provisional =
    match?.estado === "EN_CURSO";

  const showScore =
    match &&
    ![
      "CANCELADO",
      "SUSPENDIDO",
    ].includes(match.estado);

  return (
    <ResultsLayout>
      {/* Tarjetas superiores */}
      <ResultsStats
        matches={list.data ?? []}
        loading={list.isPending}
      />

      {/* Navegación y actualización */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/resultados"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1457c5]"
        >
          <ArrowLeft size={15} />

          Volver a resultados
        </Link>

        <button
          type="button"
          onClick={() =>
            void Promise.all([
              detail.refetch(),
              list.refetch(),
            ])
          }
          disabled={
            detail.isFetching ||
            list.isFetching
          }
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-[#1457c5] hover:bg-[#eaf3ff] disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              detail.isFetching ||
              list.isFetching
                ? "animate-spin"
                : ""
            }
          />

          Actualizar
        </button>
      </div>

      {/* Estado inicial */}
      {detail.isPending ? (
        <section className="flex min-h-[320px] items-center justify-center gap-3 rounded-xl border border-[#d8e3f0] bg-white text-sm text-[#7184a3]">
          <RefreshCw
            size={18}
            className="animate-spin"
          />

          Cargando detalle del partido...
        </section>
      ) : detail.isError || !match ? (
        /* Error */
        <section
          role="alert"
          className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-white p-6 text-center"
        >
          <AlertCircle
            size={30}
            className="text-red-500"
          />

          <h2 className="text-sm font-bold text-[#172b4d]">
            No se pudo consultar este partido
          </h2>

          <p className="max-w-lg text-xs text-[#7184a3]">
            {getErrorMessage(detail.error)}
          </p>

          <Link
            href="/resultados"
            className="rounded-md bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white"
          >
            Volver al listado
          </Link>
        </section>
      ) : (
        <>
          {/* Marcador del partido */}
          <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
            <header className="flex flex-wrap items-center justify-between gap-2 bg-[#eaf3ff] px-5 py-3">
              <h2 className="text-sm font-bold text-[#172b4d]">
                Detalle del partido · Jornada{" "}
                {String(
                  match.jornada,
                ).padStart(2, "0")}
              </h2>

              <ResultsStatus
                state={match.estado}
              />
            </header>

            <div className="px-4 py-8 md:px-7">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-5">
                {/* Equipo local */}
                <h3 className="text-center text-sm font-bold text-[#172b4d] md:text-lg">
                  {match.equipoLocal.nombre}
                </h3>

                {/* Marcador */}
                <div className="text-center">
                  <div className="whitespace-nowrap text-3xl font-extrabold tabular-nums text-[#1457c5] md:text-5xl">
                    {showScore
                      ? match.equipoLocal.goles ?? "—"
                      : "—"}

                    {" — "}

                    {showScore
                      ? match.equipoVisitante.goles ?? "—"
                      : "—"}
                  </div>

                  {provisional && (
                    <p className="mt-2 text-[10px] font-semibold text-emerald-700">
                      Marcador provisional
                    </p>
                  )}

                  {match.estado === "FINALIZADO" && (
                    <p className="mt-2 text-[10px] font-semibold text-[#1457c5]">
                      Resultado oficial
                    </p>
                  )}
                </div>

                {/* Equipo visitante */}
                <h3 className="text-center text-sm font-bold text-[#172b4d] md:text-lg">
                  {match.equipoVisitante.nombre}
                </h3>
              </div>

              <p className="mt-7 text-center text-xs text-[#7184a3]">
                {formatResultDateTime(
                  match.fechaHoraInicio,
                )}

                {" · "}

                Cancha {match.cancha}

                {provisional &&
                  " · Actualización cada 5 s"}
              </p>
            </div>
          </section>

          {/* Historial de eventos */}
          <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
            <header className="bg-[#eaf3ff] px-5 py-3">
              <h2 className="text-sm font-bold text-[#172b4d]">
                Eventos del encuentro
              </h2>
            </header>

            {match.eventos.length === 0 ? (
              <div className="flex min-h-[165px] flex-col items-center justify-center gap-2 px-4 text-center">
                <CalendarDays
                  size={27}
                  className="text-[#1457c5]"
                />

                <p className="text-xs text-[#7184a3]">
                  Todavía no hay incidencias
                  registradas para este encuentro.
                </p>
              </div>
            ) : (
              <div className="max-h-[460px] overflow-y-auto px-5 py-1">
                {[...match.eventos]
                  .sort(
                    (first, second) =>
                      first.minuto - second.minuto ||
                      first.createdAt.localeCompare(
                        second.createdAt,
                      ),
                  )
                  .map((event) => {
                    const team =
                      event.equipoId ===
                      match.equipoLocal.id
                        ? match.equipoLocal.nombre
                        : event.equipoId ===
                            match.equipoVisitante.id
                          ? match.equipoVisitante.nombre
                          : "Equipo no disponible";

                    return (
                      <article
                        key={event.id}
                        className="flex items-center gap-3 border-b border-[#e5edf6] py-4 last:border-0"
                      >
                        <EventIcon
                          type={event.tipo}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#172b4d]">
                            {event.minuto}′
                            {" · "}
                            {EVENT_LABELS[event.tipo]}
                          </p>

                          <p className="mt-1 text-[11px] text-[#7184a3]">
                            {event.jugador}
                            {" · "}
                            {team}
                          </p>

                          {event.tipo ===
                            "ASISTENCIA" &&
                            event.golRelacionadoId && (
                              <p className="mt-1 text-[10px] text-[#1457c5]">
                                Asistencia vinculada
                                a un gol del partido
                              </p>
                            )}
                        </div>

                        <span className="text-[10px] tabular-nums text-[#7184a3]">
                          {event.minuto}′
                        </span>
                      </article>
                    );
                  })}
              </div>
            )}
          </section>

          {/* Pie de la pantalla */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-[#7184a3]">
              /resultados/partidos/{match.id}
            </p>

            <div className="flex flex-wrap gap-2">
              {/* Sin endpoint de galería todavía */}
              <button
                type="button"
                disabled
                title={
                  match.galeriaDisponible
                    ? "No existe todavía una ruta pública de galería"
                    : "Disponible al finalizar el partido"
                }
                className="rounded-lg border border-[#b9cbe2] bg-white px-4 py-2.5 text-xs font-semibold text-[#243858] opacity-60 disabled:cursor-not-allowed"
              >
                Ver galería (pendiente)
              </button>

              {/* HU posterior */}
              <button
                type="button"
                disabled
                title="La tabla de posiciones no forma parte de HU8"
                className="rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white opacity-60 disabled:cursor-not-allowed"
              >
                Tabla de posiciones
              </button>
            </div>
          </div>
        </>
      )}
    </ResultsLayout>
  );
}
