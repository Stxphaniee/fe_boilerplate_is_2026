"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, CheckCheck, Check, AlertTriangle, Loader2 } from "lucide-react";

import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsQuery,
} from "@/queries/notifications/notifications.queries";
import { getErrorMessage } from "@/lib/api/errors";
import { getNotificationLink } from "@/lib/notifications/links";
import type {
  NotificationCategory,
  NotificationFilter,
} from "@/types/notifications.types";

const FILTERS: { value: NotificationFilter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "no_leida", label: "No leídas" },
  { value: "leida", label: "Leídas" },
];

const CATEGORY_LABEL: Record<NotificationCategory, string> = {
  PAGOS: "Pagos",
  CALENDARIO: "Calendario",
  RESULTADOS: "Resultados",
  INSCRIPCIONES: "Inscripciones",
};

const dateFormat = new Intl.DateTimeFormat("es-SV", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function NotificationInbox({ role }: { role: string }) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<NotificationFilter>("todas");

  const { data, isPending, isError, error } = useNotificationsQuery(page, filter);
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const actionError = markOne.error ?? markAll.error;

  return (
    <main className="mx-auto w-full max-w-4xl px-7 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf3ff] text-[#1457c5]">
            <Bell size={22} />
            {!!data?.noLeidas && (
              <span
                id="notificaciones-contador"
                className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#e5484d] px-1.5 text-center text-[11px] font-bold text-white"
              >
                {data.noLeidas}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#172b4d]">
              Notificaciones
            </h1>
            <p className="text-sm text-[#7184a3]">
              {data ? `${data.noLeidas} pendientes de leer` : "Tus avisos de la liga"}
            </p>
          </div>
        </div>

        <button
          id="notificaciones-marcar-todas"
          type="button"
          onClick={() => markAll.mutate()}
          disabled={markAll.isPending || !data?.noLeidas}
          className="flex items-center gap-2 rounded-md bg-[#1457c5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f4399] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={16} /> Marcar todas como leídas
        </button>
      </header>

      <div role="tablist" className="mb-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            id={`notificaciones-filtro-${f.value}`}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === f.value
                ? "bg-[#102342] text-white"
                : "bg-white text-[#41557a] ring-1 ring-[#dfe6f0] hover:bg-[#eef3fa]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {getErrorMessage(actionError)}
        </p>
      )}

      {isPending ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#7184a3]">
          <Loader2 className="animate-spin" size={18} /> Cargando notificaciones...
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-md bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {getErrorMessage(error)}
        </p>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#cdd8e6] bg-white py-16 text-center text-sm text-[#7184a3]">
          No tienes notificaciones{filter === "todas" ? "" : " en este filtro"}.
        </div>
      ) : (
        <ul className="space-y-3">
          {data.items.map((n) => {
            const unread = n.estado === "NO_LEIDA";
            const link = getNotificationLink(n, role);
            return (
              <li
                key={n.id}
                className={`rounded-xl border bg-white p-4 shadow-sm transition ${
                  unread ? "border-[#9cc0f5] border-l-4 border-l-[#1457c5]" : "border-[#e1e8f0] opacity-80"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {n.categoria && (
                        <span className="rounded-full bg-[#eaf3ff] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#1457c5]">
                          {CATEGORY_LABEL[n.categoria]}
                        </span>
                      )}
                      {n.esCritica && (
                        <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-700">
                          <AlertTriangle size={11} /> Importante
                        </span>
                      )}
                      <time className="text-[11px] text-[#8a9ab5]">
                        {dateFormat.format(new Date(n.createdAt))}
                      </time>
                    </div>
                    <h2 className={`text-sm text-[#172b4d] ${unread ? "font-bold" : "font-medium"}`}>
                      {n.titulo}
                    </h2>
                    <p className="mt-1 whitespace-pre-line text-sm text-[#52627d]">{n.mensaje}</p>
                    {link && (
                      <Link
                        href={link.href}
                        className="mt-2 inline-block text-xs font-semibold text-[#1457c5] hover:underline"
                      >
                        {link.label} →
                      </Link>
                    )}
                  </div>
                  {unread && (
                    <button
                      id={`notificacion-leer-${n.id}`}
                      type="button"
                      onClick={() => markOne.mutate(n.id)}
                      disabled={markOne.isPending}
                      className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[#1457c5] hover:bg-[#eaf3ff]"
                    >
                      <Check size={14} /> Marcar como leída
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {data && data.total > data.limit && (
        <nav className="mt-6 flex items-center justify-center gap-3 text-sm" aria-label="Paginación">
          <button
            id="notificaciones-anterior"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md px-3 py-1.5 ring-1 ring-[#dfe6f0] disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-[#52627d]">
            Página {page} de {totalPages}
          </span>
          <button
            id="notificaciones-siguiente"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md px-3 py-1.5 ring-1 ring-[#dfe6f0] disabled:opacity-40"
          >
            Siguiente
          </button>
        </nav>
      )}
    </main>
  );
}
