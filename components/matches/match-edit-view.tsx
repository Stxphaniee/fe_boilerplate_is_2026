
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle2, X } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MatchEditForm } from "@/components/matches/match-edit-form";

import { useMatchEdit } from "@/hooks/use-match-edit";
import { useMatchForEditQuery } from "@/queries/matches/matches.queries";
import { getErrorMessage } from "@/lib/api/errors";

import type { MatchEditData } from "@/types/matches.types";

interface MatchEditViewProps {
  matchId: string;
  initialRoundId?: string;
}

export function MatchEditView({
  matchId,
  initialRoundId,
}: MatchEditViewProps) {
  const matchQuery = useMatchForEditQuery(
    matchId,
    initialRoundId,
  );

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar role="ORGANIZADOR" />

      <div className="min-h-screen pl-[200px]">
        <AppHeader
          title="Edición y suspensión de partidos"
          description="Modifica horarios y canchas o registra suspensiones por fuerza mayor."
          role="ORGANIZADOR"
        />

        <main className="mx-auto w-full max-w-[1150px] space-y-4 p-5 md:p-7">
          <div className="mb-1 flex items-center justify-between gap-3">
            <Link
              href="/admin/partidos/nuevo"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1457c5] transition hover:text-[#1049a8]"
            >
              <ArrowLeft size={15} />
              Volver a programación
            </Link>

            {matchQuery.data && (
              <span className="text-[11px] text-[#7184a3]">
                Jornada{" "}
                {String(matchQuery.data.jornadaNumero).padStart(2, "0")}
              </span>
            )}
          </div>

          {matchQuery.isLoading && !matchQuery.data ? (
            <section className="rounded-xl border border-[#d8e3f0] bg-white p-10 text-center">
              <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#d8e3f0] border-t-[#1457c5]" />

              <p className="text-sm font-medium text-[#1a2b4a]">
                Cargando información del partido...
              </p>

              <p className="mt-1 text-xs text-[#7184a3]">
                Estamos consultando la jornada y sus asignaciones.
              </p>
            </section>
          ) : !matchQuery.data ? (
            <section className="rounded-xl border border-red-200 bg-white p-7 text-center">
              <AlertCircle className="mx-auto mb-3 text-red-500" size={28} />

              <h2 className="text-base font-bold text-[#1a2b4a]">
                No fue posible cargar el partido
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-[#7184a3]">
                {getErrorMessage(matchQuery.error)}
              </p>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => void matchQuery.refetch()}
                  className="rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1049a8]"
                >
                  Reintentar
                </button>

                <Link
                  href="/admin/partidos/nuevo"
                  className="rounded-lg border border-[#cbd8e8] px-4 py-2.5 text-xs font-semibold text-[#1a2b4a] hover:bg-[#f5f8fc]"
                >
                  Volver
                </Link>
              </div>
            </section>
          ) : (
            <MatchEditLoadedView
              matchId={matchId}
              data={matchQuery.data}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function MatchEditLoadedView({
  matchId,
  data,
}: {
  matchId: string;
  data: MatchEditData;
}) {
  const edit = useMatchEdit(matchId, data);

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");

  async function handleSuspend() {
    const completed = await edit.suspendMatch(suspensionReason);

    if (completed) {
      setIsSuspendModalOpen(false);
      setSuspensionReason("");
    }
  }

  async function handleCancel() {
    const completed = await edit.cancelMatch();

    if (completed) {
      setIsCancelModalOpen(false);
    }
  }

  return (
    <>
      {edit.successMessage && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-800"
        >
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          <p>{edit.successMessage}</p>
        </div>
      )}

      {edit.errorMessage && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{edit.errorMessage}</p>
        </div>
      )}

      <MatchEditForm
        data={data}
        date={edit.date}
        time={edit.time}
        court={edit.court}
        canEdit={edit.canEdit}
        canSave={edit.canSave}
        canSuspend={edit.canSuspend}
        canCancel={edit.canCancel}
        isSuspended={edit.isSuspended}
        isSaving={edit.isSaving}
        onDateChange={edit.changeDate}
        onTimeChange={edit.changeTime}
        onCourtChange={edit.changeCourt}
        onSave={() => void edit.saveChanges()}
        onSuspend={() => {
          edit.clearMessages();
          setSuspensionReason("");
          setIsSuspendModalOpen(true);
        }}
        onCancel={() => {
          edit.clearMessages();
          setIsCancelModalOpen(true);
        }}
      />

      {/* Modal de suspensión */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1830]/55 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="suspend-modal-title"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="suspend-modal-title"
                  className="text-base font-bold text-[#1a2b4a]"
                >
                  Suspender partido
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#7184a3]">
                  Indica el motivo de la suspensión. Este dato será registrado
                  junto al partido.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSuspendModalOpen(false)}
                disabled={edit.isSaving}
                aria-label="Cerrar"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <label
              htmlFor="suspension-reason"
              className="mt-5 block text-xs font-semibold text-[#1a2b4a]"
            >
              Motivo de suspensión *
            </label>

            <textarea
              id="suspension-reason"
              rows={4}
              maxLength={250}
              value={suspensionReason}
              onChange={(event) => setSuspensionReason(event.target.value)}
              placeholder="Ej. Lluvia intensa en la cancha."
              disabled={edit.isSaving}
              className="mt-2 w-full resize-none rounded-lg border border-[#cbd8e8] px-3 py-2.5 text-xs text-[#243858] outline-none transition placeholder:text-gray-400 focus:border-[#1457c5] focus:ring-2 focus:ring-[#1457c5]/10 disabled:bg-gray-50"
            />

            <div className="mt-1 flex justify-between text-[10px] text-[#7184a3]">
              <span>El motivo es obligatorio.</span>
              <span>{suspensionReason.length}/250</span>
            </div>

            {edit.errorMessage && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {edit.errorMessage}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSuspendModalOpen(false)}
                disabled={edit.isSaving}
                className="rounded-lg border border-[#cbd8e8] px-4 py-2.5 text-xs font-semibold text-[#1a2b4a] hover:bg-[#f5f8fc] disabled:opacity-50"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={() => void handleSuspend()}
                disabled={edit.isSaving || !suspensionReason.trim()}
                className="rounded-lg bg-[#1457c5] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1049a8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {edit.isSaving ? "Procesando..." : "Confirmar suspensión"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Modal de cancelación */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1830]/55 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="cancel-modal-title"
                  className="text-base font-bold text-[#1a2b4a]"
                >
                  Confirmar cancelación
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#7184a3]">
                  ¿Estás seguro de que deseas cancelar este partido? La acción
                  cambiará su estado a CANCELADO y no podrá modificarse después.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={edit.isSaving}
                aria-label="Cerrar"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {edit.errorMessage && (
              <p role="alert" className="mt-3 text-xs text-red-600">
                {edit.errorMessage}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={edit.isSaving}
                className="rounded-lg border border-[#cbd8e8] px-4 py-2.5 text-xs font-semibold text-[#1a2b4a] hover:bg-[#f5f8fc] disabled:opacity-50"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={() => void handleCancel()}
                disabled={edit.isSaving}
                className="rounded-lg bg-[#e43d4d] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#c92f3e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {edit.isSaving ? "Procesando..." : "Confirmar cancelación"}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
