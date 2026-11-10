
"use client";

import { useEffect } from "react";

interface RejectionModalProps {
  open: boolean;
  teamName: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  error?: string | null;
}

export function RejectionModal({
  open,
  teamName,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  isSaving,
  error,
}: RejectionModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [open, isSaving, onClose]);

  if (!open) return null;

  const trimmedReason = reason.trim();

  const isValid =
    trimmedReason.length >= 1 &&
    trimmedReason.length <= 250;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#09172f]/60 px-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rejection-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
      >
        <h2
          id="rejection-title"
          className="text-xl font-bold text-[#172b4d]"
        >
          Rechazar inscripción
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Indica el motivo por el que se rechaza la
          inscripción de{" "}
          <strong>{teamName}</strong>.
        </p>

        <label
          htmlFor="rejection-reason"
          className="mt-6 block text-sm font-semibold text-[#172b4d]"
        >
          Motivo de rechazo
        </label>

        <textarea
          id="rejection-reason"
          value={reason}
          onChange={(event) =>
            onReasonChange(event.target.value)
          }
          maxLength={250}
          rows={5}
          placeholder="Describe las observaciones que debe corregir el capitán..."
          className="mt-2 w-full resize-none rounded-lg border border-[#d8e3f0] p-3 text-sm text-[#172b4d] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-right text-xs text-slate-500">
          {reason.length}/250 caracteres
        </p>

        {error && (
          <p
            role="alert"
            className="mt-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!isValid || isSaving}
            className="rounded-lg bg-[#e63946] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#c92836] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving
              ? "Rechazando..."
              : "Confirmar rechazo"}
          </button>
        </div>
      </div>
    </div>
  );
}
