"use client";

import Link from "next/link";

import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import {
  useRefereeMatchesQuery,
} from "@/queries/referee/referee.queries";

import {
  getErrorMessage,
} from "@/lib/api/errors";

import { RefereeLayout } from "./referee-layout";

import {
  RefereeMatchStatus,
} from "./match-scoreboard";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(
    "es-SV",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "America/El_Salvador",
    },
  );
}

function RefereeMatchesContent({
  userId,
}: {
  userId: string;
}) {
  const matchesQuery =
    useRefereeMatchesQuery(userId);

  if (matchesQuery.isPending) {
    return (
      <section className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-[#d8e3f0] bg-white">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#d8e3f0] border-t-[#1457c5]" />

        <p className="text-sm text-[#7184a3]">
          Cargando partidos asignados...
        </p>
      </section>
    );
  }

  if (matchesQuery.isError) {
    return (
      <section className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle
          size={28}
          className="mx-auto mb-3 text-red-500"
        />

        <h2 className="text-sm font-bold text-[#172b4d]">
          No se pudieron cargar los partidos
        </h2>

        <p className="mt-3 text-xs text-[#7184a3]">
          {getErrorMessage(matchesQuery.error)}
        </p>

        <button
          type="button"
          onClick={() =>
            void matchesQuery.refetch()
          }
          className="mt-4 rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white"
        >
          Reintentar
        </button>
      </section>
    );
  }

  const matches = matchesQuery.data ?? [];

  const stats = [
    {
      name: "Asignados",
      value: matches.length,
      color: "#1457c5",
    },
    {
      name: "Programados",
      value: matches.filter(
        (match) =>
          match.estado === "PROGRAMADO",
      ).length,
      color: "#8794bd",
    },
    {
      name: "En curso",
      value: matches.filter(
        (match) =>
          match.estado === "EN_CURSO",
      ).length,
      color: "#16a085",
    },
    {
      name: "Finalizados",
      value: matches.filter(
        (match) =>
          match.estado === "FINALIZADO",
      ).length,
      color: "#d99a18",
    },
  ];

  return (
    <>
      {/* Tarjetas de resumen */}
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.name}
            className="flex items-center gap-3 rounded-xl border border-[#d8e3f0] bg-white p-5"
          >
            <div
              aria-hidden="true"
              className="h-11 w-1 rounded-full"
              style={{
                backgroundColor: stat.color,
              }}
            />

            <div>
              <p className="text-xs text-[#7184a3]">
                {stat.name}
              </p>

              <p className="mt-2 text-2xl font-bold text-[#172b4d]">
                {String(stat.value).padStart(2, "0")}
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* Tabla de partidos */}
      <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
        <header className="flex items-center justify-between bg-[#eaf3ff] px-5 py-3">
          <h2 className="text-sm font-bold text-[#172b4d]">
            Mis partidos asignados
          </h2>

          <button
            type="button"
            title="Actualizar partidos"
            aria-label="Actualizar partidos"
            disabled={matchesQuery.isFetching}
            onClick={() =>
              void matchesQuery.refetch()
            }
            className="rounded-md p-2 text-[#1457c5] hover:bg-blue-100"
          >
            <RefreshCw
              size={16}
              className={
                matchesQuery.isFetching
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </header>

        {matches.length === 0 ? (
          <div className="flex min-h-[290px] flex-col items-center justify-center p-6 text-center">
            <CalendarDays
              size={36}
              className="mb-4 text-[#1457c5]"
            />

            <h3 className="text-sm font-semibold text-[#172b4d]">
              No tienes partidos asignados
            </h3>

            <p className="mt-2 text-xs text-[#7184a3]">
              Tus partidos aparecerán cuando
              el organizador publique una
              jornada en la que estés asignado.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto p-3">
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
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {matches.map((match) => (
                  <tr
                    key={match.id}
                    className="border-b border-[#e5edf6] text-[#243858] hover:bg-[#f8fafd]"
                  >
                    <td className="px-3 py-4 font-semibold">
                      J{String(match.jornada).padStart(2, "0")}
                    </td>

                    <td className="px-3 py-4 font-medium">
                      {match.equipoLocal.nombre}
                      {" vs "}
                      {match.equipoVisitante.nombre}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      {formatDateTime(
                        match.fechaHoraInicio,
                      )}
                    </td>

                    <td className="px-3 py-4">
                      Cancha {match.cancha}
                    </td>

                    <td className="px-3 py-4">
                      <RefereeMatchStatus
                        status={match.estado}
                      />
                    </td>

                    <td className="px-3 py-4">
                      <Link
                        href={`/arbitro/partidos/${match.id}`}
                        className="inline-flex items-center gap-2 rounded-md bg-[#1457c5] px-3 py-2.5 font-semibold text-white transition hover:bg-[#1049a8]"
                      >
                        {match.estado === "PROGRAMADO" ||
                        match.estado === "EN_CURSO"
                          ? "Abrir panel"
                          : "Ver partido"}

                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="rounded-xl bg-[#eaf3ff] p-4 text-xs leading-5 text-[#243858]">
        Solo aparecen los partidos de jornadas
        publicadas que te han sido asignados.
        La lista se actualiza cada 5 segundos.
      </div>
    </>
  );
}

export function RefereeMatchesView() {
  return (
    <RefereeLayout
      title="Mis partidos asignados"
      description="Consulta tus encuentros y accede al panel de control del árbitro."
    >
      {(userId) => (
        <RefereeMatchesContent
          key={userId}
          userId={userId}
        />
      )}
    </RefereeLayout>
  );
}