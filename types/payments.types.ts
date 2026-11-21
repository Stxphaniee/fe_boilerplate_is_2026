export interface PayRegistrationPayload {
  ultimos4: string;
  titular: string;
  expiracion: string;
  monto: number;
}

export interface PaymentReceipt {
  comprobanteId: string;
  ultimos4: string;
  monto: number;
  estado: string;
  fechaPago: string;
  equipoNombre?: string;
}