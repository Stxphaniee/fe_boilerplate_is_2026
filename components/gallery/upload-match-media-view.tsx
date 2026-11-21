"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, AlertCircle, Film, Image as ImageIcon } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";
import { validateGalleryFiles } from "@/services/gallery.service";
import {
  useMatchGalleryQuery,
  useUploadMatchMediaMutation,
} from "@/queries/gallery/gallery.queries";

const MAX_FILES = 20;

export function UploadMatchMediaView({
  matchId,
  role,
}: {
  matchId: string;
  role: string;
}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const isOrganizer = role.toUpperCase() === "ORGANIZADOR";
  const { data: existingMedia = [] } = useMatchGalleryQuery(matchId);
  const uploadMutation = useUploadMatchMediaMutation(matchId, setProgress);

  const currentCount = existingMedia.length;
  const remainingSlots = Math.max(0, MAX_FILES - currentCount);

  if (!isOrganizer) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">
            Solo el rol Organizador puede subir fotografías o videos a un partido finalizado.
          </p>
          <Link
            href="/resultados"
            className="mt-4 inline-block font-semibold text-[#1457c5] hover:underline"
          >
            Volver a resultados
          </Link>
        </div>
      </main>
    );
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSuccessMessage(null);
    setProgress(0);
    const list = event.target.files ? Array.from(event.target.files) : [];
    const errorMsg = validateGalleryFiles(list, currentCount);
    setValidationError(errorMsg);
    setSelectedFiles(errorMsg ? [] : list);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSuccessMessage(null);

    const errorMsg = validateGalleryFiles(selectedFiles, currentCount);
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    setValidationError(null);
    setProgress(10);

    try {
      await uploadMutation.mutateAsync(selectedFiles);
      setSelectedFiles([]);
      setProgress(100);
      setSuccessMessage("Archivos multimedia subidos correctamente a la galería.");
    } catch (err) {
      setProgress(0);
      setValidationError(getErrorMessage(err));
    }
  }

  function handleClear() {
    setSelectedFiles([]);
    setValidationError(null);
    setSuccessMessage(null);
    setProgress(0);
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1457c5]">
            Partido #{matchId} · Finalizado
          </p>
          <h1 className="text-2xl font-bold text-[#172b4d]">
            Subir fotografías y highlights
          </h1>
          <p className="text-sm text-[#64748b]">
            Formatos permitidos: JPG, PNG y MP4 · Máximo 50 MB por archivo y 20 por partido.
          </p>
        </div>

        <div className="rounded-lg border border-[#dce5f2] bg-white px-4 py-2 text-right shadow-sm">
          <span className="block text-xs text-[#64748b]">Ocupados / Máximo</span>
          <span className="text-base font-bold text-[#172b4d]">
            {String(currentCount).padStart(2, "0")}/{MAX_FILES}
          </span>
          <span className="block text-[11px] text-[#1457c5]">
            {remainingSlots} disponibles
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
      >
        <label
          htmlFor="galeria-archivos"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] px-6 py-8 text-center transition hover:border-[#1457c5] hover:bg-[#f0f6ff]"
        >
          <Upload className="mb-2 h-8 w-8 text-[#1457c5]" />
          <span className="text-sm font-semibold text-[#172b4d]">
            Selecciona o arrastra archivos JPG, PNG o MP4
          </span>
          <span className="mt-1 text-xs text-[#64748b]">
            Hasta {remainingSlots} archivo(s) restantes · Máximo 50 MB cada uno
          </span>
          <input
            id="galeria-archivos"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,video/mp4"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>

        {selectedFiles.length > 0 && (
          <ul className="divide-y divide-[#e2e8f0] rounded-lg border border-[#e2e8f0]">
            {selectedFiles.map((file) => {
              const isVideo = file.type.startsWith("video/");
              const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
              return (
                <li
                  key={`${file.name}-${file.size}`}
                  className="flex items-center justify-between px-4 py-2.5 text-sm"
                >
                  <span className="flex items-center gap-2 font-medium text-[#1e293b]">
                    {isVideo ? (
                      <Film className="h-4 w-4 text-[#1457c5]" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-[#1457c5]" />
                    )}
                    {file.name}
                  </span>
                  <span className="text-xs text-[#64748b]">{sizeMb} MB</span>
                </li>
              );
            })}
          </ul>
        )}

        {(uploadMutation.isPending || progress > 0) && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium text-[#475569]">
              <span>{uploadMutation.isPending ? "Subiendo lote..." : "Progreso"}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
              <div
                className="h-full bg-[#1457c5] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {validationError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Link
            href={`/partidos/${matchId}/galeria`}
            className="text-sm font-medium text-[#1457c5] hover:underline"
          >
            Ver galería del partido →
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={uploadMutation.isPending}
              className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-sm font-semibold text-[#334155] hover:bg-[#f8fafc] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isPending || Boolean(validationError)}
              className="rounded-lg bg-[#1457c5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f4399] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadMutation.isPending ? "Subiendo..." : "Subir archivos"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
