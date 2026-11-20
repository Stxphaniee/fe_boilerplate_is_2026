
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import {
  getErrorMessage,
} from "@/lib/api/errors";

import {
  usePublicResultsQuery,
} from "@/queries/results/results.queries";

import { ResultsLayout } from "./results-layout";
import { ResultsStats } from "./results-stats";
import { ResultsStatus } from "./results-status";

import {
  formatResultDateTime,
  type ResultsFilter,
} from "@/types/results.types";

// =====================================================
// FILTROS DISPONIBLES
// =====================================================

const FILTERS: {
  label: string;
  value: ResultsFilter;
}[] = [
  { label: "Todos", value: "TODOS" },
  { label: "En curso", value: "EN_CURSO" },
  { label: "Finalizados", value: "FINALIZADO" },
  { label: "Programados", value: "PROGRAMADO" },
  { label: "Suspendidos", value: "SUSPENDIDO" },
  { label: "Cancelados", value: "CANCELADO" },
];

// =====================================================
// PANTALLA DE RESULTADOS
// =====================================================

export function ResultsListView() {
  const query = usePublicResultsQuery();

  const [filter, setFilter] =
    useState<ResultsFilter>("TODOS");

  const matches = query.data ?? [];

  const filtered = [...matches]
    .filter(
      (match) =>
        filter === "TODOS" ||
        match.estado === filter,
    )
    .sort(
      (first, second) =>
        new Date(first.fechaHoraInicio).getTime() -
        new Date(second.fechaHoraInicio).getTime(),
    );

  return (
    <ResultsLayout>
      {/* Tarjetas de resumen */}
      <ResultsStats
        matches={matches}
        loading={query.isPending}
      />

      {/* Listado de partidos */}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
        <header className="flex flex-wrap items-center justify-between gap-3 bg-[#eaf3ff] px-5 py-3">
          <h2 className="text-sm font-bold text-[#172b4d]">
            Resultados y encuentros por jornada
          </h2>

          <button
            type="button"
            aria-label="Actualizar resultados"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1457c5] disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={
                query.isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Actualizar
          </button>
        </header>

        <div className="p-4">
          {/* Filtro */}
          <label
            htmlFor="results-filter"
            className="mb-2 block text-xs font-semibold text-[#172b4d]"
          >
            Filtrar por estado
          </label>

          <select
            id="results-filter"
            value={filter}
            onChange={(event) =>
              setFilter(
                event.target.value as ResultsFilter,
              )
            }
            className="mb-4 h-10 w-full max-w-xs rounded-md border border-[#cbd8e8] bg-white px-3 text-xs text-[#243858]"
          >
            {FILTERS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Cargando */}
          {query.isPending ? (
            <div className="flex min-h-[240px] items-center justify-center gap-3 text-sm text-[#7184a3]">
              <RefreshCw
                className="animate-spin"
                size={18}
              />

              Cargando resultados oficiales...
            </div>
          ) : query.isError ? (
            /* Error */
            <div
              role="alert"
              className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center"
            >
              <AlertCircle
                size={28}
                className="text-red-500"
              />

              <p className="text-sm font-semibold text-[#172b4d]">
                No se pudieron cargar los resultados
              </p>

              <p className="text-xs text-[#7184a3]">
                {getErrorMessage(query.error)}
              </p>

              <button
                type="button"
                onClick={() => void query.refetch()}
                className="rounded-lg bg-[#1457c5] px-4 py-2 text-xs font-semibold text-white"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            /* Sin partidos */
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
              <CalendarDays
                size={28}
                className="text-[#1457c5]"
              />

              <p className="text-sm font-semibold text-[#172b4d]">
                No hay partidos disponibles con este filtro
              </p>

              <p className="text-xs text-[#7184a3]">
                Los encuentros aparecerán cuando se
                publiquen sus jornadas.
              </p>
            </div>
          ) : (
            /* Tabla de resultados */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead>
                  <tr className="bg-[#f3f7fc] text-[#7184a3]">
                    <th className="px-3 py-3 font-medium">
                      Jornada
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Encuentro
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Fecha / hora
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Cancha
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Estado
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Detalle
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((match) => (
                    <tr
                      key={match.id}
                      className="border-b border-[#e5edf6] text-[#243858] last:border-0 hover:bg-[#f8fafd]"
                    >
                      <td className="px-3 py-4 font-semibold">
                        J
                        {String(
                          match.jornada,
                        ).padStart(2, "0")}
                      </td>

                      <td className="px-3 py-4">
                        <p className="font-medium">
                          {match.equipoLocal.nombre}
                          {" vs "}
                          {match.equipoVisitante.nombre}
                        </p>

                        <p className="mt-1 text-sm font-bold tabular-nums text-[#1457c5]">
                          {match.equipoLocal.goles ?? "—"}
                          {" — "}
                          {match.equipoVisitante.goles ?? "—"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4">
                        {formatResultDateTime(
                          match.fechaHoraInicio,
                        )}
                      </td>

                      <td className="px-3 py-4">
                        Cancha {match.cancha}
                      </td>

                      <td className="px-3 py-4">
                        <ResultsStatus
                          state={match.estado}
                        />
                      </td>

                      <td className="px-3 py-4">
                        <Link
                          href={`/resultados/partidos/${match.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-[#1457c5] px-3 py-2 font-semibold text-white hover:bg-[#1049a8]"
                        >
                          Ver partido
                          <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Aviso de actualización */}
      <div className="rounded-xl bg-[#eaf3ff] p-4 text-xs text-[#243858]">
        Los resultados se actualizan cada 5 segundos
        mientras la página está visible. Se muestran
        únicamente jornadas publicadas.
      </div>

      <p className="text-[10px] text-[#7184a3]">
        /resultados
      </p>
    </ResultsLayout>
  );
}
