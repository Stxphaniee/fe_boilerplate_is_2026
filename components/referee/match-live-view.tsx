"use client";

import Link from "next/link";

import {
  AlertCircle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  LockKeyhole,
  RefreshCw,
  Play,
  Square,
} from "lucide-react";

import {
  ApiError,
  getErrorMessage,
} from "@/lib/api/errors";

import {
  useRefereePanel,
} from "@/hooks/use-referee-panel";

import { RefereeLayout } from "./referee-layout";
import { MatchScoreboard } from "./match-scoreboard";
import { MatchEventForm } from "./match-event-form";
import { MatchParticipants } from "./match-participants";

interface MatchLiveViewProps {
  matchId: string;
}

function MatchLiveContent({
  userId,
  matchId,
}: {
  userId: string;
  matchId: string;
}) {
  const live = useRefereePanel(
    userId,
    matchId,
  );

  const panel = live.panel;

  const queryError =
    live.panelQuery.error;

  const definitiveError =
    queryError instanceof ApiError &&
    [401, 403, 404].includes(
      queryError.status,
    );

  function handleFinish() {
    if (
      !live.canFinish ||
      live.hasParticipantChanges
    ) {
      return;
    }

    const confirmed = window.confirm(
      "¿Deseas finalizar el partido? El marcador se convertirá en el resultado oficial y ya no podrás registrar nuevas incidencias.",
    );

    if (confirmed) {
      void live.changeMatchState(
        "FINALIZADO",
      );
    }
  }

  // =====================================================
  // ESTADO DE CARGA
  // =====================================================

  if (live.panelQuery.isPending) {
    return (
      <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-[#d8e3f0] bg-white p-6">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#d8e3f0] border-t-[#1457c5]" />

        <p className="text-sm text-[#7184a3]">
          Cargando panel de control...
        </p>
      </section>
    );
  }

  // =====================================================
  // ESTADO DE ERROR
  // =====================================================

  if (!panel || definitiveError) {
    return (
      <section className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertCircle
          size={32}
          className="mx-auto mb-4 text-red-500"
        />

        <h2 className="text-lg font-bold text-[#172b4d]">
          No fue posible cargar el partido
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm text-[#7184a3]">
          {getErrorMessage(queryError)}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              void live.panelQuery.refetch()
            }
            className="rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white"
          >
            Reintentar
          </button>

          <Link
            href="/arbitro/partidos"
            className="rounded-lg border border-[#cbd8e8] px-4 py-2.5 text-xs font-semibold text-[#243858]"
          >
            Volver a mis partidos
          </Link>
        </div>
      </section>
    );
  }

  const isClosed =
    panel.estado === "FINALIZADO" ||
    panel.estado === "CANCELADO" ||
    panel.estado === "SUSPENDIDO";

  return (
    <>
      {/* Navegacion superior */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/arbitro/partidos"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#1457c5]"
        >
          <ArrowLeft size={15} />
          Volver a mis partidos
        </Link>

        <button
          type="button"
          title="Actualizar partido"
          disabled={live.panelQuery.isFetching}
          onClick={() =>
            void live.panelQuery.refetch()
          }
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs text-[#1457c5] hover:bg-[#eaf3ff]"
        >
          <RefreshCw
            size={15}
            className={
              live.panelQuery.isFetching
                ? "animate-spin"
                : ""
            }
          />

          Actualizar
        </button>
      </div>

      {/* Mensajes de operaciones */}
      {live.notice && (
        <div
          role={
            live.notice.type === "success"
              ? "status"
              : "alert"
          }
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-xs ${
            live.notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {live.notice.type === "success" ? (
            <CheckCircle2
              size={18}
              className="shrink-0"
            />
          ) : (
            <AlertCircle
              size={18}
              className="shrink-0"
            />
          )}

          <p>{live.notice.message}</p>
        </div>
      )}

      {/* Error temporal durante polling */}
      {live.panelQuery.isError && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
        >
          No fue posible actualizar el partido.
          Se muestra la última información
          disponible. Las acciones permanecerán
          deshabilitadas hasta recuperar la conexión.
        </div>
      )}

      {/* Marcador principal */}
      <MatchScoreboard
        panel={panel}
        clock={live.clock}
      />

      {/* Incidencias y participaciones */}
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1.75fr_1fr]">
        <MatchEventForm
          form={live.form}
          players={live.eligiblePlayers}
          homeTeam={panel.equipoLocal}
          awayTeam={panel.equipoVisitante}
          availableGoals={live.availableGoals}
          suggestedMinute={live.suggestedMinute}
          disabled={!live.canRegister}
          onChange={live.changeEventField}
          onSubmit={() =>
            void live.saveEvent()
          }
        />

        <MatchParticipants
          panel={panel}
          draft={live.participantDraft}
          disabled={!live.canRegister}
          hasChanges={
            live.hasParticipantChanges
          }
          isSaving={
            live.isSavingParticipants
          }
          onChange={
            live.changeParticipant
          }
          onSave={() =>
            void live.saveParticipants()
          }
        />
      </div>

      {/* Aviso oficial */}
      <section className="flex items-start gap-3 rounded-xl bg-[#eaf3ff] px-5 py-4">
        {isClosed ? (
          <LockKeyhole
            size={19}
            className="shrink-0 text-[#1457c5]"
          />
        ) : (
          <Bell
            size={19}
            className="shrink-0 text-[#1457c5]"
          />
        )}

        <div>
          <h3 className="text-xs font-bold text-[#172b4d]">
            {isClosed
              ? "Partido no editable"
              : "Control exclusivo del árbitro asignado"}
          </h3>

          <p className="mt-2 text-xs leading-5 text-[#243858]">
            {panel.estado === "FINALIZADO"
              ? "El resultado del partido es oficial. No se permiten nuevas incidencias."
              : isClosed
                ? "Este encuentro no se encuentra habilitado para registrar incidencias."
                : "Solo se aceptan eventos de partidos EN_CURSO. El marcador se calcula a partir de los goles registrados."}
          </p>

          {!isClosed && (
            <p className="mt-2 text-[10px] text-[#7184a3]">
              Actualización del servidor cada
              5 segundos. Reloj local cada segundo.
            </p>
          )}
        </div>
      </section>

      {live.hasParticipantChanges && (
        <p className="text-xs font-medium text-amber-700">
          Tienes participaciones sin guardar.
          Guárdalas antes de finalizar el partido.
        </p>
      )}

      {/* Acciones principales */}
      <div className="flex flex-wrap justify-center gap-3">

        {/* Iniciar partido */}
        <button
          type="button"
          disabled={!live.canStart}
          onClick={() =>
            void live.changeMatchState(
              "EN_CURSO",
            )
          }
          className="inline-flex min-w-[155px] items-center justify-center gap-2 rounded-lg border border-[#b9cbe2] bg-white px-4 py-3 text-xs font-semibold text-[#243858] transition hover:bg-[#eaf3ff] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Play size={14} />

          {live.isChangingState &&
          panel.estado === "PROGRAMADO"
            ? "Iniciando..."
            : "Iniciar partido"}
        </button>

        {/* Registrar evento */}
        <button
          type="submit"
          form="match-event-form"
          disabled={!live.canRegister}
          className="min-w-[155px] rounded-lg bg-[#1457c5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#1049a8] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {live.isSavingEvent
            ? "Registrando..."
            : "Registrar evento"}
        </button>

        {/* Finalizar partido */}
        <button
          type="button"
          onClick={handleFinish}
          disabled={
            !live.canFinish ||
            live.hasParticipantChanges
          }
          className="inline-flex min-w-[155px] items-center justify-center gap-2 rounded-lg bg-[#e43d4d] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#c92f3e] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Square size={13} />

          {live.isChangingState &&
          panel.estado === "EN_CURSO"
            ? "Finalizando..."
            : "Finalizar partido"}
        </button>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 py-2 text-[10px] text-[#7184a3]">
        <span>
          /arbitro/partidos/{matchId}
        </span>

        <span>HU7 / 23</span>
      </footer>
    </>
  );
}

export function MatchLiveView({
  matchId,
}: MatchLiveViewProps) {
  return (
    <RefereeLayout
      title="Panel de control de árbitro"
      description="Registra goles, tarjetas, asistencias y participantes del encuentro asignado."
    >
      {(userId) => (
        <MatchLiveContent
          key={`${userId}:${matchId}`}
          userId={userId}
          matchId={matchId}
        />
      )}
    </RefereeLayout>
  );
}