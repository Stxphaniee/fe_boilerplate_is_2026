export type PaymentStatus = "PAGADO" | "PENDIENTE" | "VENCIDO";

export interface TeamPaymentRow {
  equipoId: string;
  equipoNombre: string;
  cuota: number;
  vencimiento: string | null;
  estado: PaymentStatus;
  fechaPago: string | null;
}

export interface PaymentsReportSummary {
  totalEquipos: number;
  pagados: number;
  pendientes: number;
  vencidos: number;
  totalRecaudado: number;
  detalle: TeamPaymentRow[];
}
