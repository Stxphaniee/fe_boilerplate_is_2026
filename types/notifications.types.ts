export type NotificationCategory =
  | "PAGOS"
  | "CALENDARIO"
  | "RESULTADOS"
  | "INSCRIPCIONES";

export type NotificationStatus = "NO_LEIDA" | "LEIDA";

export type NotificationFilter = "todas" | "no_leida" | "leida";

export type NotificationItem = {
  id: string;
  titulo: string;
  mensaje: string;
  categoria: NotificationCategory | null;
  moduloOrigen: NotificationCategory | null;
  referencia: string | null;
  estado: NotificationStatus;
  esCritica: boolean;
  createdAt: string;
  leidaAt: string | null;
};

export type NotificationInbox = {
  items: NotificationItem[];
  page: number;
  limit: number;
  total: number;
  noLeidas: number;
};
