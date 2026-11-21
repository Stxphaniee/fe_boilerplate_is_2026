"use client";

import {
  Activity,
  AlertCircle,
  Award,
  CircleDot,
  Square,
  UserX,
} from "lucide-react";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import { useMyPlayerStatsQuery } from "@/queries/stats/player-stats.queries";

interface MyPlayerStatsViewProps {
  role: string;
}

const ALLOWED_ROLES = new Set(["JUGADOR", "CAPITAN"]);

export function MyPlayerStatsView({ role }: MyPlayerStatsViewProps) {
  const isAllowed = ALLOWED_ROLES.has(role.toUpperCase());
  const { data, isLoading, isError, error } = useMyPlayerStatsQuery(isAllowed);

  if (!isAllowed) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">
            Solo los usuarios con rol Jugador o Capitán pueden consultar sus estadísticas individuales.
          </p>
        </div>
      </main>
    );
  }

  const isNotLinked = error instanceof ApiError && error.status === 404;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#172b4d]">
          Mis estadísticas individuales
        </h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Rendimiento acumulado exclusivamente en partidos oficiales con estado FINALIZADO.
        </p>
        {data && (data.jugadorNombre || data.equipoNombre) && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-[#1e3a8a]">
            {data.jugadorNombre && (
              <span className="rounded-full bg-[#eff6ff] px-3 py-1">
                Jugador: {data.jugadorNombre}
              </span>
            )}
            {data.equipoNombre && (
              <span className="rounded-full bg-[#eff6ff] px-3 py-1">
                Equipo: {data.equipoNombre}
              </span>
            )}
            {data.dorsal !== undefined && (
              <span className="rounded-full bg-[#eff6ff] px-3 py-1">
                Dorsal #{data.dorsal}
              </span>
            )}
            {data.posicion && (
              <span className="rounded-full bg-[#eff6ff] px-3 py-1">
                {data.posicion}
              </span>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-28 animate-pulse rounded-xl border border-[#e2e8f0] bg-[#f1f5f9]"
            />
          ))}
        </div>
      ) : isNotLinked ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900"
        >
          <UserX className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Sin ficha de jugador vinculada (404)</p>
            <p className="mt-1">
              Tu cuenta aún no está vinculada a una ficha de jugador activa en la temporada.
            </p>
          </div>
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">No se pudieron cargar tus estadísticas</p>
            <p className="mt-1">{getErrorMessage(error)}</p>
          </div>
        </div>
      ) : (
        <>
          {data && data.partidosJugados === 0 && (
            <div className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-5 text-center">
              <p className="text-base font-semibold text-[#172b4d]">
                Sin participación en partidos oficiales
              </p>
              <p className="mt-1 text-sm text-[#64748b]">
                Tus estadísticas se actualizarán automáticamente al finalizar tus encuentros oficiales.
              </p>
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                <span>Partidos jugados (PJ)</span>
                <Activity className="h-4 w-4 text-[#1457c5]" />
              </div>
              <p className="mt-2 text-3xl font-bold text-[#172b4d]">
                {data?.partidosJugados ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                <span>Goles</span>
                <CircleDot className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {data?.goles ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                <span>Asistencias</span>
                <Award className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-indigo-700">
                {data?.asistencias ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                <span>Tarjetas amarillas</span>
                <Square className="h-4 w-4 fill-amber-400 text-amber-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-amber-700">
                {data?.tarjetasAmarillas ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-[#64748b]">
                <span>Tarjetas rojas</span>
                <Square className="h-4 w-4 fill-red-500 text-red-600" />
              </div>
              <p className="mt-2 text-3xl font-bold text-red-700">
                {data?.tarjetasRojas ?? 0}
              </p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}