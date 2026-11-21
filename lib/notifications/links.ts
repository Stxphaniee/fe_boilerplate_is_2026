import type { NotificationItem } from "@/types/notifications.types";

export type NotificationLink = { href: string; label: string } | null;

/**
 * Enlace contextual de cada aviso según su categoría y el rol del usuario.
 * Las historias que emiten avisos agregan aquí su destino.
 */
export function getNotificationLink(
  _notification: NotificationItem,
  _role: string,
): NotificationLink {
  return null;
}
