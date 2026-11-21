import { apiRequest } from "@/lib/api/client";
import type { PayRegistrationPayload, PaymentReceipt } from "@/types/payments.types";

export async function payRegistrationFee(
  payload: PayRegistrationPayload,
): Promise<PaymentReceipt> {
  const res = await apiRequest<Record<string, unknown>>("pagos", {
    method: "POST",
    body: payload,
  });

  const src =
    typeof res.data === "object" && res.data !== null
      ? (res.data as Record<string, unknown>)
      : res;

  return {
    comprobanteId: String(src.comprobanteId ?? src.receiptId ?? src.id ?? "COMP-OK"),
    ultimos4: String(src.ultimos4 ?? src.last4 ?? payload.ultimos4),
    monto: typeof src.monto === "number" ? src.monto : payload.monto,
    estado: String(src.estado ?? src.status ?? "PAGADO"),
    fechaPago: String(src.fechaPago ?? src.paidAt ?? new Date().toISOString()),
    equipoNombre:
      typeof src.equipoNombre === "string"
        ? src.equipoNombre
        : typeof src.teamName === "string"
          ? src.teamName
          : undefined,
  };
}