
"use client";

import Link from "next/link";

import {
  AlertCircle,
  Bell,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  AppHeader,
} from "@/components/layout/app-header";

import {
  AppSidebar,
} from "@/components/layout/app-sidebar";

import {
  CalendarStats,
} from "./calendar-stats";

import {
  CalendarMatchesTable,
} from "./calendar-matches-table";

import {
  useMyCalendar,
} from "@/hooks/use-my-calendar";

import {
  ApiError,
  getErrorMessage,
} from "@/lib/api/errors";

// =====================================================
// ESTADO DE CARGA
// =====================================================

function CalendarLoading() {
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[#d8e3f0] bg-white p-6 text-center">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-[3px] border-[#d8e3f0] border-t-[#1457c5]" />

      <h2 className="text-sm font-semibold text-[#172b4d]">
        Cargando calendario de partidos...
      </h2>

      <p className="mt-2 text-xs text-[#7184a3]">
        Consultando la programación de tu equipo.
      </p>
    </section>
  );
}

// =====================================================
// ESTADO DE ERROR
// =====================================================

interface CalendarErrorProps {
  title: string;
  message: string;
  onRetry: () => void;
}

function CalendarError({
  title,
  message,
  onRetry,
}: CalendarErrorProps) {
  return (
    <section
      role="alert"
      className="flex min-h-[285px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-6 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle
          size={25}
          className="text-red-500"
        />
      </div>

      <h2 className="text-sm font-bold text-[#172b4d]">
        {title}
      </h2>

      <p className="mt-2 max-w-lg text-xs leading-5 text-[#7184a3]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1049a8]"
      >
        <RefreshCw size={14} />

        Intentar nuevamente
      </button>
    </section>
  );
}

// =====================================================
// PANTALLA DEL CALENDARIO - HU6
// =====================================================

export function CalendarView() {
  const calendar = useMyCalendar();

  // =====================================================
  // VALIDACION DE IDENTIDAD
  // =====================================================

  if (calendar.isUserLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <CalendarLoading />
      </main>
    );
  }

  if (calendar.isUserError) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <CalendarError
          title="No fue posible verificar tu sesión"
          message={getErrorMessage(
            calendar.userError,
          )}
          onRetry={() =>
            void calendar.refetchUser()
          }
        />
      </main>
    );
  }

  // =====================================================
  // PERMISOS DEL CALENDARIO
  // =====================================================

  if (!calendar.role) {
    return (
      <main className="mx-auto w-full max-w-3xl p-6">
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[#d8e3f0] bg-white p-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ShieldCheck size={27} />
          </div>

          <h1 className="text-xl font-bold text-[#172b4d]">
            Acceso no autorizado
          </h1>

          <p className="mt-3 max-w-md text-sm text-[#7184a3]">
            Esta pantalla está disponible
            exclusivamente para jugadores
            y capitanes de la liga.
          </p>

          <Link
            href="/"
            className="mt-5 rounded-lg bg-[#1457c5] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1049a8]"
          >
            Volver al inicio
          </Link>
        </section>
      </main>
    );
  }

  // =====================================================
  // DATOS Y ESTADOS
  // =====================================================

  const isForbidden =
    calendar.calendarError instanceof ApiError &&
    calendar.calendarError.status === 403;

  const lastUpdate =
    calendar.updatedAt > 0 &&
    calendar.isCalendarSuccess
      ? new Date(
          calendar.updatedAt,
        ).toLocaleTimeString("es-SV", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
          timeZone: "America/El_Salvador",
        })
      : null;

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar role={calendar.role} />

      <div className="ml-[200px] min-h-screen">
        <AppHeader
          title="Mi calendario de partidos"
          description="Consulta la programación, horarios, rivales y estados de tu equipo."
          role={calendar.role}
        />

        <main className="mx-auto w-full max-w-[1400px] space-y-4 p-5 md:p-7">
          {/* Tarjetas de resumen */}
          <CalendarStats
            stats={calendar.stats}
            isLoading={calendar.isCalendarLoading}
            hasData={calendar.isCalendarSuccess}
          />

          {/* Calendario de partidos */}
          {calendar.isCalendarLoading ? (
            <CalendarLoading />
          ) : calendar.isCalendarError ? (
            <CalendarError
              title={
                isForbidden
                  ? "Calendario no disponible"
                  : "No fue posible cargar el calendario"
              }
              message={getErrorMessage(
                calendar.calendarError,
              )}
              onRetry={() =>
                void calendar.refetchCalendar()
              }
            />
          ) : (
            <CalendarMatchesTable
              matches={calendar.matches}
              teamName={calendar.stats.teamName}
            />
          )}

          {/* Aviso de consulta oficial */}
          <section className="flex items-start gap-3 rounded-xl bg-[#eaf3ff] px-5 py-4">
            <Bell
              size={19}
              className="mt-0.5 shrink-0 text-[#1457c5]"
            />

            <div className="flex-1">
              <h3 className="text-xs font-bold text-[#172b4d]">
                Consulta oficial del calendario
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#243858]">
                La lista se actualiza cada 5 segundos
                mientras consultas esta pantalla y
                mantiene visibles los partidos suspendidos
                y cancelados.
              </p>

              {lastUpdate && (
                <p className="mt-2 flex items-center gap-2 text-[10px] text-[#7184a3]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      calendar.isRefreshing
                        ? "animate-pulse bg-[#1457c5]"
                        : "bg-[#16a085]"
                    }`}
                  />

                  {calendar.isRefreshing
                    ? "Actualizando calendario..."
                    : `Última actualización: ${lastUpdate}`}
                </p>
              )}
            </div>

            <button
              type="button"
              title="Actualizar calendario"
              aria-label="Actualizar calendario"
              onClick={() =>
                void calendar.refetchCalendar()
              }
              disabled={calendar.isRefreshing}
              className="rounded-md p-2 text-[#1457c5] transition hover:bg-blue-100 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={16}
                className={
                  calendar.isRefreshing
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </section>

          {/* Pie de pantalla */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-[#7184a3]">
              /mi-equipo/calendario
            </p>

            {/* HU8 - Consulta pública habilitada */}
            <Link
              href="/resultados"
              className="inline-flex min-w-[190px] items-center justify-center rounded-lg bg-[#1457c5] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#1049a8]"
            >
              Consultar resultados
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
