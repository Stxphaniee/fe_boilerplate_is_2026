"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ShieldAlert, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/queries/notifications/preferences.queries";
import type { NotificationPreferences } from "@/types/notification-preferences.types";

const CATEGORY_ITEMS: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: "pagos",
    title: "Pagos",
    description: "Recordatorios y estados de cuotas o pagos del equipo.",
  },
  {
    key: "calendario",
    title: "Calendario",
    description: "Publicación de jornadas, programación y cambios en partidos.",
  },
  {
    key: "resultados",
    title: "Resultados",
    description: "Marcadores finales y actualizaciones de encuentros.",
  },
  {
    key: "inscripciones",
    title: "Inscripciones",
    description: "Novedades y aprobaciones vinculadas a inscripciones.",
  },
];

export function NotificationPreferencesView() {
  const { data, isLoading, isError, error } = useNotificationPreferencesQuery();
  const updateMutation = useUpdateNotificationPreferencesMutation();

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    pagos: true,
    calendario: true,
    resultados: true,
    inscripciones: true,
  });
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setPrefs(data);
    }
  }, [data]);

  function handleToggle(key: keyof NotificationPreferences) {
    setSavedBanner(null);
    setErrorBanner(null);
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSavedBanner(null);
    setErrorBanner(null);

    try {
      const updated = await updateMutation.mutateAsync(prefs);
      setPrefs(updated);
      setSavedBanner("Preferencias de notificación guardadas correctamente.");
    } catch (err) {
      setErrorBanner(getErrorMessage(err));
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-6">
        <Link
          href="/notificaciones"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1457c5] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a notificaciones
        </Link>

        <div className="flex items-center gap-2.5">
          <Bell className="h-6 w-6 text-[#1457c5]" />
          <h1 className="text-2xl font-bold text-[#172b4d]">
            Preferencias de notificación
          </h1>
        </div>
        <p className="mt-1 text-sm text-[#64748b]">
          Activa o desactiva los avisos no críticos por categoría. Por defecto todas las categorías están activadas.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="font-semibold">Avisos críticos obligatorios</p>
          <p className="mt-0.5 text-xs leading-relaxed text-amber-800">
            Los avisos críticos —como el rechazo de inscripción de equipo o la suspensión de equipo— son obligatorios y siempre se entregarán aunque desactives categorías.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-16 animate-pulse rounded-lg bg-[#f1f5f9]"
            />
          ))}
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="space-y-4 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm"
        >
          {isError && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                No se pudieron cargar tus preferencias guardadas ({getErrorMessage(error)}). Se muestran los valores por defecto.
              </span>
            </div>
          )}

          <div className="divide-y divide-[#e2e8f0]">
            {CATEGORY_ITEMS.map((item) => {
              const checked = prefs[item.key];
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <label
                      htmlFor={`pref-${item.key}`}
                      className="text-sm font-semibold text-[#172b4d]"
                    >
                      {item.title}
                    </label>
                    <p className="text-xs text-[#64748b]">{item.description}</p>
                  </div>

                  <button
                    id={`pref-${item.key}`}
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-label={item.title}
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      checked ? "bg-[#1457c5]" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                        checked ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          {errorBanner && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorBanner}</span>
            </div>
          )}

          {savedBanner && (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{savedBanner}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-lg bg-[#1457c5] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0f4399] disabled:opacity-50"
            >
              {updateMutation.isPending ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
