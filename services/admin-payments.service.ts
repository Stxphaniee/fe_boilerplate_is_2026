import { apiRequest } from "@/lib/api/client";
import type {
  AdminPaymentFilter,
  AdminPaymentRow,
  TeamSuspensionPayload,
} from "@/types/admin-payments.types";

function normalizePayment(raw: unknown, idx: number): AdminPaymentRow | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const rawPay = String(r.estadoPago ?? r.estado ?? r.status ?? "PENDIENTE").toUpperCase();
  const estadoPago: AdminPaymentRow["estadoPago"] =
    rawPay === "PAGADO" || rawPay === "VENCIDO" ? rawPay : "PENDIENTE";

  return {
    pagoId: String(r.pagoId ?? r.id ?? idx),
    equipoId: String(r.equipoId ?? r.teamId ?? idx),
    equipoNombre: String(r.equipoNombre ?? r.equipo ?? r.teamName ?? "Equipo"),
    estadoEquipo: String(r.estadoEquipo ?? r.teamStatus ?? "APROBADO").toUpperCase(),
    estadoPago,
    monto: typeof r.monto === "number" ? r.monto : typeof r.amount === "number" ? r.amount : 50,
    fechaVencimiento:
      typeof r.fechaVencimiento === "string"
        ? r.fechaVencimiento
        : typeof r.dueDate === "string"
          ? r.dueDate
          : undefined,
    fechaPago:
      typeof r.fechaPago === "string"
        ? r.fechaPago
        : typeof r.paidAt === "string"
          ? r.paidAt
          : undefined,
    comprobanteId:
      typeof r.comprobanteId === "string" ? r.comprobanteId : undefined,
  };
}

export async function getAdminPayments(
  estado: AdminPaymentFilter,
): Promise<AdminPaymentRow[]> {
  const qs = estado === "TODOS" ? "" : `?estado=${encodeURIComponent(estado)}`;
  const res = await apiRequest<unknown>(`admin/pagos${qs}`, { method: "GET" });

  const list = Array.isArray(res)
    ? res
    : typeof res === "object" && res !== null
      ? (Array.isArray((res as Record<string, unknown>).items) &&
          ((res as Record<string, unknown>).items as unknown[])) ||
        (Array.isArray((res as Record<string, unknown>).pagos) &&
          ((res as Record<string, unknown>).pagos as unknown[])) ||
        (Array.isArray((res as Record<string, unknown>).data) &&
          ((res as Record<string, unknown>).data as unknown[])) ||
        []
      : [];

  return list
    .map((item, idx) => normalizePayment(item, idx))
    .filter((row): row is AdminPaymentRow => row !== null);
}

export async function updateTeamSuspension({
  equipoId,
  accion,
  motivo,
}: TeamSuspensionPayload): Promise<unknown> {
  return apiRequest(`admin/equipos/${encodeURIComponent(equipoId)}/suspension`, {
    method: "PATCH",
    body: { accion, motivo },
  });
}