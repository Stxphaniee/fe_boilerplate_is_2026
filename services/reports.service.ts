import { apiRequest } from "@/lib/api/client";
import type { PaymentsReportSummary, TeamPaymentRow, PaymentStatus } from "@/types/reports.types";

const EMPTY_REPORT: PaymentsReportSummary = {
  totalEquipos: 0,
  pagados: 0,
  pendientes: 0,
  vencidos: 0,
  totalRecaudado: 0,
  detalle: [],
};

function normalizeStatus(raw: unknown): PaymentStatus {
  const s = typeof raw === "string" ? raw.toUpperCase() : "";
  if (s === "PAGADO") return "PAGADO";
  if (s === "VENCIDO") return "VENCIDO";
  return "PENDIENTE";
}

function normalizeRow(raw: unknown, idx: number): TeamPaymentRow {
  const r = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    equipoId: typeof r.equipoId === "string" ? r.equipoId : String(r.id ?? idx),
    equipoNombre:
      typeof r.equipoNombre === "string"
        ? r.equipoNombre
        : typeof r.equipo === "string"
          ? r.equipo
          : `Equipo ${idx + 1}`,
    cuota: typeof r.cuota === "number" ? r.cuota : 50,
    vencimiento: typeof r.vencimiento === "string" ? r.vencimiento : null,
    estado: normalizeStatus(r.estado),
    fechaPago: typeof r.fechaPago === "string" ? r.fechaPago : null,
  };
}

export async function getPaymentsReport(): Promise<PaymentsReportSummary> {
  const res = await apiRequest<unknown>("admin/reportes/pagos", { method: "GET" });
  if (typeof res !== "object" || res === null) {
    return { ...EMPTY_REPORT };
  }
  const obj = res as Record<string, unknown>;
  const rawList = Array.isArray(obj.detalle)
    ? obj.detalle
    : Array.isArray(obj.items)
      ? obj.items
      : [];

  return {
    totalEquipos: typeof obj.totalEquipos === "number" ? obj.totalEquipos : rawList.length,
    pagados: typeof obj.pagados === "number" ? obj.pagados : 0,
    pendientes: typeof obj.pendientes === "number" ? obj.pendientes : 0,
    vencidos: typeof obj.vencidos === "number" ? obj.vencidos : 0,
    totalRecaudado: typeof obj.totalRecaudado === "number" ? obj.totalRecaudado : 0,
    detalle: rawList.map((row, idx) => normalizeRow(row, idx)),
  };
}

export async function exportPaymentsReport(formato: "pdf" | "xlsx"): Promise<void> {
  const res = await fetch(`/api/admin/reportes/pagos/exportar?formato=${formato}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`No se pudo exportar el reporte en formato ${formato.toUpperCase()}.`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte-pagos.${formato}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
