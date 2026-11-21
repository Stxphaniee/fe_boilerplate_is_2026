"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Image as ImageIcon, ArrowLeft, X } from "lucide-react";
import { ApiError, getErrorMessage } from "@/lib/api/errors";
import { usePublicMatchGalleryQuery } from "@/queries/gallery/gallery.queries";
import type { MatchMediaItem } from "@/types/gallery.types";

function isVideoItem(item: MatchMediaItem): boolean {
  return (
    item.tipo === "VIDEO" ||
    item.mimeType?.toLowerCase().startsWith("video/") ||
    item.url.toLowerCase().endsWith(".mp4")
  );
}

export function MatchGalleryView({ matchId }: { matchId: string }) {
  const [activeItem, setActiveItem] = useState<MatchMediaItem | null>(null);
  const { data, isLoading, isError, error } = usePublicMatchGalleryQuery(matchId);

  const items = (data?.items ?? []).filter(
    (item) => !item.partidoId || item.partidoId === matchId,
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-5">
        <div>
          <Link
            href={`/partidos/${matchId}`}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1457c5] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al detalle del partido
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#172b4d]">
              Galería del partido
            </h1>
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
              {data?.estado ?? "FINALIZADO"}
            </span>
          </div>

          <p className="mt-1 text-sm text-[#64748b]">
            Partido #{matchId}
            {data?.jornada !== undefined ? ` · Jornada ${data.jornada}` : ""}
            {data?.marcador ? ` · Marcador: ${data.marcador}` : ""}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 animate-pulse rounded-xl border border-[#e2e8f0] bg-[#f1f5f9]"
            />
          ))}
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">
            {error instanceof ApiError && error.status === 404
              ? "Partido no encontrado (404)"
              : error instanceof ApiError && error.status === 409
                ? "Galería no disponible para este estado (409)"
                : "No se pudo cargar la galería"}
          </p>
          <p className="mt-1">{getErrorMessage(error)}</p>
        </div>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-[#475569]">
            No hay contenido multimedia disponible para este encuentro
          </p>
        </div>
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const video = isVideoItem(item);
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="group relative block h-52 w-full bg-[#0f172a] text-left"
                >
                  {video ? (
                    <video
                      src={item.url}
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Contenido multimedia del partido ${matchId}`}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-[1.02]"
                    />
                  )}

                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {video ? (
                      <>
                        <Film className="h-3 w-3" />
                        VIDEO
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3 w-3" />
                        FOTO
                      </>
                    )}
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0f172a] p-4 text-white shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                {isVideoItem(activeItem) ? "Reproductor de video" : "Vista ampliada"}
              </span>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Cerrar visor"
                className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isVideoItem(activeItem) ? (
              <video
                src={activeItem.url}
                controls
                autoPlay
                className="max-h-[75vh] w-full rounded-lg bg-black"
              />
            ) : (
              <img
                src={activeItem.url}
                alt={`Vista ampliada del partido ${matchId}`}
                className="max-h-[75vh] w-full rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
