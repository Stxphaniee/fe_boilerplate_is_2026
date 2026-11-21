"use client";

import { useState } from "react";
import { AlertCircle, Award, Trophy } from "lucide-react";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import { useFeaturedPlayersRankingQuery } from "@/queries/stats/ranking.queries";
import type { RankingCategory } from "@/types/ranking.types";

const CATEGORIES: { value: RankingCategory; label: string; metricLabel: string }[] = [
  { value: "goles", label: "Goles", metricLabel: "Goles" },
  { value: "asistencias", label: "Asistencias", metricLabel: "Asistencias" },
  { value: "amarillas", label: "Tarjetas amarillas", metricLabel: "Amarillas" },
  { value: "rojas", label: "Tarjetas rojas", metricLabel: "Rojas" },
];

export function FeaturedPlayersView({ role }: { role: string }) {
  const isOrganizer = role.toUpperCase() === "ORGANIZADOR";
  const [categoria, setCategoria] = useState<RankingCategory>("goles");

  const { data, isLoading, isError, error } = useFeaturedPlayersRankingQuery(
    categoria,
    isOrganizer,
  );

  if (!isOrganizer) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">
            Solo el rol Organizador puede consultar el ranking de jugadores destacados.
          </p>
        </div>
      </main>
    );
  }

  const activeCategory =
    CATEGORIES.find((c) => c.value === categoria) ?? CATEGORIES[0];
  const rows = data ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1457c5]">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#172b4d]">
              Ranking de jugadores destacados (Top 10)
            </h1>
            <p className="text-sm text-[#64748b]">
              Solo partidos FINALIZADO y equipos aprobados. Desempate: mayor cifra &rarr; menor PJ &rarr; orden alfabético.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categoría de ranking">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              role="tab"
              aria-selected={categoria === cat.value}
              onClick={() => setCategoria(cat.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                categoria === cat.value
                  ? "bg-[#1457c5] text-white"
                  : "bg-[#f8fafc] text-[#475569] ring-1 ring-[#cbd5e1] hover:bg-[#eef3fa]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b] shadow-sm">
          Cargando ranking Top 10...
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">
              {error instanceof ApiError && error.status === 403
                ? "Error de permisos (403)"
                : "No se pudo cargar el ranking"}
            </p>
            <p className="mt-1">{getErrorMessage(error)}</p>
          </div>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center shadow-sm">
          <Award className="mx-auto h-10 w-10 text-[#94a3b8]" />
          <p className="mt-3 text-base font-semibold text-[#172b4d]">
            No hay jugadores destacados en esta categoría
          </p>
          <p className="mt-1 text-sm text-[#64748b]">
            Los jugadores con cifra 0 se excluyen automáticamente del Top 10.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold uppercase tracking-wide text-[#475569]">
                  <th className="px-4 py-3 text-center">#</th>
                  <th className="px-4 py-3">Jugador</th>
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3 text-center">PJ</th>
                  <th className="px-4 py-3 text-center">
                    {activeCategory.metricLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {rows.map((row) => (
                  <tr key={row.jugadorId} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 text-center font-bold text-[#172b4d]">
                      {row.posicion}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#172b4d]">
                      {row.jugadorNombre}
                      {row.dorsal !== undefined && (
                        <span className="ml-2 text-xs font-normal text-[#64748b]">
                          #{row.dorsal}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#475569]">
                      {row.equipoNombre}
                    </td>
                    <td className="px-4 py-3 text-center text-[#475569]">
                      {row.partidosJugados}
                    </td>
                    <td className="px-4 py-3 text-center text-base font-bold text-[#1457c5]">
                      {row.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}