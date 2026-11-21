
"use client";

import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Users,
  RefreshCw,
} from "lucide-react";

import { useValidationPage } from "@/hooks/use-validation-page";
import { RejectionModal } from "./rejection-modal";

const POSITION_LABELS = {
  PORTERO: "Portero",
  DEFENSA: "Defensa",
  MEDIOCAMPISTA: "Mediocampista",
  DELANTERO: "Delantero",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-SV");
}

export function RegistrationDashboard() {
  const {
    pendingTeams,
    pendingCount,
    stats,
    selectedTeam,
    selectedTeamId,
    selectTeam,
    isLoading,
    isError,
    queryError,
    refetch,
    isDetailLoading,
    isDetailError,
    isSaving,
    canReview,
    actionError,
    approveTeam,
    rejectTeam,
    isRejectModalOpen,
    openRejectModal,
    closeRejectModal,
    rejectionReason,
    setRejectionReason,
  } = useValidationPage();

  const statCards = [
    {
      title: "Pendientes",
      value: String(stats?.pending ?? pendingCount).padStart(2, "0"),
      color: "#1261cb",
      icon: ClipboardList,
    },
    {
      title: "Aprobados",
      value: stats
        ? String(stats.approved).padStart(2, "0")
        : "—",
      color: "#20a77a",
      icon: CheckCircle2,
    },
    {
      title: "Rechazados",
      value: stats
        ? String(stats.rejected).padStart(2, "0")
        : "—",
      color: "#8393bc",
      icon: XCircle,
    },
    {
      title: "Total equipos",
      value: stats
        ? String(stats.total).padStart(2, "0")
        : "—",
      color: "#d79b25",
      icon: Users,
    },
  ];

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8fd] p-6">
        <p className="text-sm text-slate-600">
          Verificando acceso y cargando inscripciones...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8fd] p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#172b4d]">
            No se pudo acceder a inscripciones
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Verifica que tu sesión corresponda a un organizador.
            Si ya tienes acceso, comprueba la conexión con el servidor.
          </p>

          <p className="mt-3 text-xs text-red-700">
            {queryError?.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8fd] text-[#172b4d]">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#dce6f3] bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-bold">
            Validación de inscripciones
          </h1>

          <p className="mt-2 text-sm text-[#8290a7]">
            Aprueba o rechaza las solicitudes pendientes de los equipos.
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block rounded-full bg-[#eaf3ff] px-4 py-1 text-xs font-semibold text-blue-700">
            Organizador
          </span>

          <p className="mt-2 text-xs text-[#8290a7]">
            Liga Mayor Amateur · 2026
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-5 py-6">
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.title}
                className="flex min-h-28 items-center gap-3 rounded-xl border border-[#d8e3f0] bg-white p-4"
              >
                <div
                  className="h-14 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#7889a5]">
                    {stat.title}
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>

                <Icon
                  size={19}
                  className="shrink-0 text-slate-300"
                />
              </article>
            );
          })}
        </section>

        <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
          <div className="flex items-center justify-between bg-[#eaf3ff] px-5 py-4">
            <h2 className="font-bold">
              Solicitudes pendientes
            </h2>

            <button
              type="button"
              onClick={() => refetch()}
              aria-label="Actualizar solicitudes"
              className="rounded-lg p-2 text-blue-700 hover:bg-blue-100"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="min-h-56 overflow-x-auto p-4">
            {pendingTeams.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-500">
                No hay inscripciones pendientes.
              </p>
            ) : (
              <table className="w-full min-w-[730px] text-left text-sm">
                <thead className="bg-[#f3f7fc] text-xs text-[#7889a5]">
                  <tr>
                    <th className="px-4 py-3">Equipo</th>
                    <th className="px-4 py-3">Capitán</th>
                    <th className="px-4 py-3">Jugadores</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingTeams.map((team) => (
                    <tr
                      key={team.id}
                      className={`border-b border-[#edf1f7] ${
                        selectedTeamId === team.id
                          ? "bg-[#f0f6ff]"
                          : "hover:bg-[#f8faff]"
                      }`}
                    >
                      <td className="px-4 py-4 font-semibold">
                        {team.name}
                      </td>

                      <td className="px-4 py-4">
                        {team.captainEmail ?? "No disponible"}
                      </td>

                      <td className="px-4 py-4">
                        {team.players.length}
                      </td>

                      <td className="px-4 py-4">
                        {formatDate(team.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#eaf3ff] px-3 py-1 text-xs font-semibold text-[#1261cb]">
                          PENDIENTE
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => selectTeam(team.id)}
                          className="font-medium text-[#1261cb] hover:underline"
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
          <div className="bg-[#eaf3ff] px-5 py-4">
            <h2 className="font-bold">
              Detalle seleccionado
            </h2>
          </div>

          <div className="p-5">
            {!selectedTeamId ? (
              <p className="text-sm text-slate-500">
                Selecciona una inscripción para ver su información.
              </p>
            ) : isDetailLoading ? (
              <p className="text-sm text-slate-500">
                Cargando detalle del equipo...
              </p>
            ) : isDetailError || !selectedTeam ? (
              <p className="text-sm text-red-700">
                No fue posible consultar el detalle.
              </p>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold">
                    {selectedTeam.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Capitán: {selectedTeam.captainEmail ?? "No disponible"}
                    {" · "}
                    {selectedTeam.players.length} jugadores
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-[#f3f7fc] text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-3">Jugador</th>
                        <th className="px-3 py-3">DUI</th>
                        <th className="px-3 py-3">Posición</th>
                        <th className="px-3 py-3">Camiseta</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedTeam.players.map((player) => (
                        <tr
                          key={player.id}
                          className="border-b border-slate-100"
                        >
                          <td className="px-3 py-3">
                            {player.name}
                          </td>

                          <td className="px-3 py-3">
                            {player.dui}
                          </td>

                          <td className="px-3 py-3">
                            {POSITION_LABELS[player.position]}
                          </td>

                          <td className="px-3 py-3">
                            {player.jerseyNumber}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {actionError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        {selectedTeam && (
          <div className="flex flex-wrap justify-end gap-3 pb-5">
            <button
              type="button"
              onClick={openRejectModal}
              disabled={!canReview}
              className="min-w-48 rounded-lg bg-[#e63946] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c92836] disabled:opacity-50"
            >
              Rechazar inscripción
            </button>

            <button
              type="button"
              onClick={approveTeam}
              disabled={!canReview}
              className="min-w-48 rounded-lg bg-[#0757c9] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0348aa] disabled:opacity-50"
            >
              {isSaving
                ? "Procesando..."
                : "Aprobar inscripción"}
            </button>
          </div>
        )}
      </div>

      <RejectionModal
        open={isRejectModalOpen}
        teamName={selectedTeam?.name ?? ""}
        reason={rejectionReason}
        onReasonChange={setRejectionReason}
        onClose={closeRejectModal}
        onConfirm={rejectTeam}
        isSaving={isSaving}
        error={actionError}
      />
    </main>
  );
}
