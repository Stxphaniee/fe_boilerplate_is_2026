"use client";

import { Trophy, Square, CircleDot, CheckCircle2 } from "lucide-react";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import { useSeasonGeneralStatsQuery } from "@/queries/reports/season-stats.queries";

export function SeasonGeneralStatsView({ role }: { role: string }) {
  const isOrganizer = role.toUpperCase() === "ORGANIZADOR";
  const { data, isLoading, isError, error } = useSeasonGeneralStatsQuery(isOrganizer);

  if (!isOrganizer) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">
            Solo el rol Organizador puede consultar las estadísticas generales de la temporada.
          </p>
        </div>
      </main>
    );
  }

  const stats = data ?? {
    golesTotales: 0,
    amarillasTotales: 0,
    rojasTotales: 0,
    partidosFinalizados: 0,
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#172b4d]">
          Estadísticas generales de la temporada
        </h1>
        <p className="text-sm text-[#64748b]">
          Acumulado de partidos en estado FINALIZADO de la temporada activa.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 animate-pulse rounded-xl border border-[#e2e8f0] bg-[#f1f5f9]"
            />
          ))}
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">
            {error instanceof ApiError && error.status === 403
              ? "Error de permisos (403)"
              : "No se pudieron cargar las estadísticas"}
          </p>
          <p className="mt-1">{getErrorMessage(error)}</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
              <span>Goles totales</span>
              <CircleDot className="h-4 w-4 text-[#1457c5]" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#172b4d]">
              {stats.golesTotales}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
              <span>Tarjetas amarillas</span>
              <Square className="h-4 w-4 fill-amber-400 text-amber-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {stats.amarillasTotales}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
              <span>Tarjetas rojas</span>
              <Square className="h-4 w-4 fill-red-500 text-red-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-red-700">
              {stats.rojasTotales}
            </p>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
              <span>Partidos finalizados</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {stats.partidosFinalizados}
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
