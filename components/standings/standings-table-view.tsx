"use client";

import { AlertCircle, RefreshCw, Trophy } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getErrorMessage } from "@/lib/api/errors";
import { useStandingsQuery } from "@/queries/standings/standings.queries";

interface StandingsTableViewProps {
  highlightedTeamId?: string;
}

export function StandingsTableView({
  highlightedTeamId,
}: StandingsTableViewProps) {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useStandingsQuery();

  const rows = data?.tabla ?? [];

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar role="PUBLICO" />

      <div className="min-h-screen md:ml-[200px]">
        <AppHeader
          role="PUBLICO"
          title="Tabla de posiciones"
          description="Clasificación oficial de la temporada activa calculada automáticamente."
        />

        <main className="mx-auto w-full max-w-[1400px] space-y-5 p-4 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1457c5]">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#172b4d]">
                  {data?.temporada ?? "Temporada Activa"}
                </h1>
                <p className="text-xs text-[#64748b]">
                  Desempate oficial: Puntos (PTS) &rarr; Diferencia de goles (DG) &rarr; Goles a favor (GF) &rarr; Orden alfabético.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-2 text-xs font-medium text-[#172b4d] hover:bg-[#f8fafc] disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Actualizar
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b] shadow-sm">
              Cargando tabla de posiciones...
            </div>
          ) : isError ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-semibold">No se pudo cargar la tabla de posiciones</p>
                <p className="mt-1">{getErrorMessage(error)}</p>
              </div>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center shadow-sm">
              <Trophy className="mx-auto h-10 w-10 text-[#94a3b8]" />
              <p className="mt-3 text-base font-semibold text-[#172b4d]">
                No hay equipos aprobados en la temporada
              </p>
              <p className="mt-1 text-sm text-[#64748b]">
                Cuando existan equipos aprobados aparecerán automáticamente en esta clasificación.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold uppercase tracking-wide text-[#475569]">
                      <th className="px-4 py-3 text-center">Posición</th>
                      <th className="px-4 py-3">Equipo</th>
                      <th className="px-3 py-3 text-center">PJ</th>
                      <th className="px-3 py-3 text-center">PG</th>
                      <th className="px-3 py-3 text-center">PE</th>
                      <th className="px-3 py-3 text-center">PP</th>
                      <th className="px-3 py-3 text-center">GF</th>
                      <th className="px-3 py-3 text-center">GC</th>
                      <th className="px-3 py-3 text-center">DG</th>
                      <th className="px-4 py-3 text-center">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {rows.map((row) => {
                      const isHighlighted =
                        row.esMiEquipo ||
                        (Boolean(highlightedTeamId) &&
                          row.equipoId === highlightedTeamId);

                      return (
                        <tr
                          key={row.equipoId}
                          className={
                            isHighlighted
                              ? "bg-[#eff6ff] font-medium text-[#1e3a8a]"
                              : "hover:bg-[#f8fafc]"
                          }
                        >
                          <td className="px-4 py-3 text-center font-semibold text-[#172b4d]">
                            {row.posicion}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#172b4d]">
                                {row.equipo}
                              </span>
                              {isHighlighted && (
                                <span className="rounded-full bg-[#1457c5] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                                  Mi equipo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-center">{row.pj}</td>
                          <td className="px-3 py-3 text-center">{row.pg}</td>
                          <td className="px-3 py-3 text-center">{row.pe}</td>
                          <td className="px-3 py-3 text-center">{row.pp}</td>
                          <td className="px-3 py-3 text-center">{row.gf}</td>
                          <td className="px-3 py-3 text-center">{row.gc}</td>
                          <td className="px-3 py-3 text-center">
                            {row.dg > 0 ? `+${row.dg}` : row.dg}
                          </td>
                          <td className="px-4 py-3 text-center text-base font-bold text-[#1457c5]">
                            {row.pts}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
