"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";
import { usePaymentsReportQuery } from "@/queries/reports/reports.queries";
import { exportPaymentsReport } from "@/services/reports.service";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function PaymentsReportView({ role }: { role: string }) {
  const isOrganizer = role.toUpperCase() === "ORGANIZADOR";
  const [exporting, setExporting] = useState<"pdf" | "xlsx" | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const { data, isLoading, isError, error } = usePaymentsReportQuery(isOrganizer);

  if (!isOrganizer) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">
            Solo el rol Organizador puede consultar o exportar el reporte consolidado de pagos.
          </p>
        </div>
      </main>
    );
  }

  async function handleExport(formato: "pdf" | "xlsx") {
    setExportError(null);
    setExporting(formato);
    try {
      await exportPaymentsReport(formato);
    } catch (err) {
      setExportError(getErrorMessage(err));
    } finally {
      setExporting(null);
    }
  }

  const report = data ?? {
    totalEquipos: 0,
    pagados: 0,
    pendientes: 0,
    vencidos: 0,
    totalRecaudado: 0,
    detalle: [],
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#172b4d]">
            Reporte consolidado de pagos
          </h1>
          <p className="text-sm text-[#64748b]">
            Estado financiero de la temporada activa y exportación de respaldo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={exporting !== null}
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-semibold text-[#172b4d] shadow-sm hover:bg-[#f8fafc] disabled:opacity-50"
          >
            <FileText className="h-4 w-4 text-red-600" />
            {exporting === "pdf" ? "Exportando PDF..." : "Exportar PDF"}
          </button>

          <button
            type="button"
            disabled={exporting !== null}
            onClick={() => handleExport("xlsx")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1457c5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f4399] disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === "xlsx" ? "Exportando Excel..." : "Exportar Excel"}
          </button>
        </div>
      </div>

      {exportError && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{exportError}</span>
        </div>
      )}

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#64748b]">Total de equipos</p>
          <p className="mt-1 text-2xl font-bold text-[#172b4d]">{report.totalEquipos}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#64748b]">Pagados</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{report.pagados}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#64748b]">Pendientes</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{report.pendientes}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#64748b]">Vencidos</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{report.vencidos}</p>
        </div>
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-[#64748b]">Total recaudado</p>
          <p className="mt-1 text-2xl font-bold text-[#1457c5]">
            {formatCurrency(report.totalRecaudado)}
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-8 text-center text-sm text-[#64748b]">
          Cargando reporte financiero...
        </div>
      ) : isError ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          {getErrorMessage(error)}
        </div>
      ) : report.detalle.length === 0 ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-10 text-center shadow-sm">
          <p className="text-sm font-medium text-[#475569]">No hay pagos registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          <table className="min-w-full divide-y divide-[#e2e8f0] text-left text-sm">
            <thead className="bg-[#f8fafc] text-xs font-semibold uppercase text-[#475569]">
              <tr>
                <th className="px-4 py-3">Equipo</th>
                <th className="px-4 py-3">Cuota</th>
                <th className="px-4 py-3">Vencimiento</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha de pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {report.detalle.map((row) => (
                <tr key={row.equipoId}>
                  <td className="px-4 py-3 font-medium text-[#172b4d]">{row.equipoNombre}</td>
                  <td className="px-4 py-3 text-[#334155]">{formatCurrency(row.cuota)}</td>
                  <td className="px-4 py-3 text-[#64748b]">{row.vencimiento ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#64748b]">{row.fechaPago ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
