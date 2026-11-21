"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";
import {
  useAdminPaymentsQuery,
  useTeamSuspensionMutation,
} from "@/queries/payments/admin-payments.queries";
import type { AdminPaymentFilter, AdminPaymentRow } from "@/types/admin-payments.types";

const FILTERS: { value: AdminPaymentFilter; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "PAGADO", label: "Pagado" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "VENCIDO", label: "Vencido" },
];

export function AdminPaymentsView({ role }: { role: string }) {
  const isOrganizer = role.toUpperCase() === "ORGANIZADOR";
  const [filter, setFilter] = useState<AdminPaymentFilter>("TODOS");
  const [selected, setSelected] = useState<{
    row: AdminPaymentRow;
    accion: "SUSPENDER" | "REACTIVAR";
  } | null>(null);
  const [motivo, setMotivo] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useAdminPaymentsQuery(filter, isOrganizer);
  const suspensionMutation = useTeamSuspensionMutation();

  if (!isOrganizer) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">Solo el rol Organizador puede consultar pagos y suspender o reactivar equipos.</p>
        </div>
      </main>
    );
  }

  async function confirmAction() {
    if (!selected || !motivo.trim()) return;
    setFeedback(null);
    try {
      await suspensionMutation.mutateAsync({
        equipoId: selected.row.equipoId,
        accion: selected.accion,
        motivo: motivo.trim(),
      });
      setFeedback(
        selected.accion === "SUSPENDER"
          ? `Equipo ${selected.row.equipoNombre} suspendido correctamente.`
          : `Equipo ${selected.row.equipoNombre} reactivado correctamente.`,
      );
      setSelected(null);
      setMotivo("");
    } catch {
      // handled via mutation.error
    }
  }

  const rows = data ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">Estado de pagos y suspensión por mora</h1>
          <p className="text-sm text-[#64748b]">Consulta el estado de cuotas por equipo y gestiona suspensiones administrativas.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === f.value
                  ? "bg-[#1457c5] text-white"
                  : "bg-[#f8fafc] text-[#475569] ring-1 ring-[#cbd5e1] hover:bg-[#eef3fa]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">
          Cargando estado de pagos...
        </div>
      ) : isError ? (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{getErrorMessage(error)}</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center text-sm text-[#64748b]">
          No hay registros de pago para el filtro seleccionado.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-xs font-semibold uppercase tracking-wide text-[#475569]">
                  <th className="px-4 py-3">Equipo</th>
                  <th className="px-4 py-3 text-center">Estado Equipo</th>
                  <th className="px-4 py-3 text-center">Cuota</th>
                  <th className="px-4 py-3 text-center">Estado Pago</th>
                  <th className="px-4 py-3 text-center">Vencimiento</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {rows.map((row) => {
                  const isOverdue = row.estadoPago === "VENCIDO";
                  const isSuspended = row.estadoEquipo === "SUSPENDIDO";
                  return (
                    <tr key={row.pagoId} className={isOverdue ? "bg-red-50/70" : "hover:bg-[#f8fafc]"}>
                      <td className="px-4 py-3 font-semibold text-[#172b4d]">{row.equipoNombre}</td>
                      <td className="px-4 py-3 text-center text-xs font-semibold">
                        <span className={`rounded-full px-2.5 py-1 ${isSuspended ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                          {row.estadoEquipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">${row.monto.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.estadoPago === "PAGADO"
                              ? "bg-emerald-100 text-emerald-700"
                              : isOverdue
                                ? "bg-red-600 text-white"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {row.estadoPago}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-[#64748b]">
                        {row.fechaVencimiento ? new Date(row.fechaVencimiento).toLocaleDateString("es-SV") : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isSuspended ? (
                          <button
                            type="button"
                            onClick={() => { setSelected({ row, accion: "REACTIVAR" }); setMotivo(""); }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Reactivar equipo
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setSelected({ row, accion: "SUSPENDER" }); setMotivo(""); }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Suspender equipo
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#172b4d]">
              {selected.accion === "SUSPENDER" ? "Confirmar suspensión" : "Confirmar reactivación"}
            </h2>
            <p className="text-sm text-[#475569]">
              Equipo: <strong>{selected.row.equipoNombre}</strong>
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#334155]">Motivo obligatorio</label>
              <textarea
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Indica el motivo administrativo..."
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] p-2.5 text-sm"
              />
            </div>
            {suspensionMutation.isError && (
              <p className="text-xs text-red-600">{getErrorMessage(suspensionMutation.error)}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-xs font-semibold text-[#475569]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!motivo.trim() || suspensionMutation.isPending}
                onClick={() => void confirmAction()}
                className="rounded-lg bg-[#1457c5] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {suspensionMutation.isPending ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}