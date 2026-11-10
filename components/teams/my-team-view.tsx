
"use client";

import { useMyTeamPage } from "@/hooks/use-my-team-page";
import { TeamCorrectionForm } from "./team-correction-form";

const STATUS_LABELS = {
  PENDIENTE_VALIDACION: "Pendiente de validación",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  SUSPENDIDO: "Suspendido",
} as const;

const POSITION_LABELS = {
  PORTERO: "Portero",
  DEFENSA: "Defensa",
  MEDIOCAMPISTA: "Mediocampista",
  DELANTERO: "Delantero",
} as const;

export function MyTeamView() {
  const {
    team,
    isLoading,
    isError,
    error,
    refetch,
    isEditing,
    startEditing,
    cancelEditing,
    name,
    setName,
    players,
    setPlayers,
    submitCorrection,
    isSubmitting,
    validationError,
    successMessage,
  } = useMyTeamPage();

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
        Cargando información de tu equipo...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <p className="font-semibold text-red-700">
          No fue posible consultar tu equipo.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {error?.message}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!team) return null;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
          Liga Mayor Amateur
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#172b4d]">
          Mi equipo
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Consulta la información de tu inscripción y plantilla.
        </p>
      </header>

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      <section className="rounded-lg border border-[#d8e3f0] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#172b4d]">
              {team.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sigla: {team.shortName}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              team.status === "RECHAZADO"
                ? "bg-red-50 text-red-700"
                : team.status === "APROBADO"
                  ? "bg-green-50 text-green-700"
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            {STATUS_LABELS[team.status]}
          </span>
        </div>

        {team.rejectionReason && (
          <div className="mt-5 rounded-md bg-red-50 p-4 text-sm text-red-700">
            <strong>Motivo de rechazo:</strong>{" "}
            {team.rejectionReason}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">
              Jugadores registrados
            </p>

            <p className="mt-1 font-semibold text-[#172b4d]">
              {team.players.length} jugadores
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Fecha de inscripción
            </p>

            <p className="mt-1 font-semibold text-[#172b4d]">
              {new Date(team.createdAt).toLocaleDateString(
                "es-SV",
              )}
            </p>
          </div>
        </div>

        {team.status === "RECHAZADO" && !isEditing && (
          <div className="mt-6 border-t border-[#e5edf6] pt-5">
            <p className="mb-4 text-sm text-slate-600">
              Puedes corregir los datos observados y solicitar
              una nueva revisión mientras esté abierto el
              período correspondiente.
            </p>

            <button
              type="button"
              onClick={startEditing}
              className="rounded-lg bg-[#1457c5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1049a8]"
            >
              Corregir y reenviar inscripción
            </button>
          </div>
        )}
      </section>

      {isEditing ? (
        <TeamCorrectionForm
          name={name}
          setName={setName}
          players={players}
          setPlayers={setPlayers}
          onSubmit={submitCorrection}
          onCancel={cancelEditing}
          isSubmitting={isSubmitting}
          error={validationError}
        />
      ) : (
        <section className="overflow-hidden rounded-lg border border-[#d8e3f0] bg-white">
          <div className="bg-[#eaf3ff] px-5 py-4">
            <h2 className="font-bold text-[#172b4d]">
              Plantilla de jugadores
            </h2>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#f3f7fc] text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Jugador</th>
                  <th className="px-4 py-3">DUI</th>
                  <th className="px-4 py-3">Nacimiento</th>
                  <th className="px-4 py-3">Posición</th>
                  <th className="px-4 py-3">Camiseta</th>
                </tr>
              </thead>

              <tbody>
                {team.players.map((player, index) => (
                  <tr
                    key={player.id}
                    className="border-b border-gray-100 text-[#172b4d]"
                  >
                    <td className="px-4 py-4">
                      {index + 1}
                    </td>

                    <td className="px-4 py-4 font-medium">
                      {player.name}
                    </td>

                    <td className="px-4 py-4">
                      {player.dui}
                    </td>

                    <td className="px-4 py-4">
                      {new Date(
                        `${player.birthDate.slice(0, 10)}T00:00:00`,
                      ).toLocaleDateString("es-SV")}
                    </td>

                    <td className="px-4 py-4">
                      {POSITION_LABELS[player.position]}
                    </td>

                    <td className="px-4 py-4">
                      {player.jerseyNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
