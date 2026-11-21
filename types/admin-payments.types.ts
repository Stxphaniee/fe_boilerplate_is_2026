export type AdminPaymentFilter = "TODOS" | "PAGADO" | "PENDIENTE" | "VENCIDO";

export interface AdminPaymentRow {
  pagoId: string;
  equipoId: string;
  equipoNombre: string;
  estadoEquipo: string;
  estadoPago: "PAGADO" | "PENDIENTE" | "VENCIDO";
  monto: number;
  fechaVencimiento?: string;
  fechaPago?: string;
  comprobanteId?: string;
}

export interface TeamSuspensionPayload {
  equipoId: string;
  accion: "SUSPENDER" | "REACTIVAR";
  motivo: string;
}