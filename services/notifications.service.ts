import { apiRequest } from "@/lib/api/client";
import type {
  NotificationFilter,
  NotificationInbox,
  NotificationItem,
} from "@/types/notifications.types";

/** GET /api/v1/notificaciones (HU20) */
export function getNotifications(
  page: number,
  filter: NotificationFilter,
  limit = 10,
): Promise<NotificationInbox> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (filter !== "todas") params.set("estado", filter);
  return apiRequest<NotificationInbox>(`notificaciones?${params}`);
}

/** PATCH /api/v1/notificaciones/:id/leer (HU20) */
export function markNotificationRead(id: string): Promise<NotificationItem> {
  return apiRequest<NotificationItem>(`notificaciones/${id}/leer`, {
    method: "PATCH",
  });
}

/** PATCH /api/v1/notificaciones/leer-todas (HU20) */
export function markAllNotificationsRead(): Promise<{
  actualizadas: number;
  noLeidas: number;
}> {
  return apiRequest("notificaciones/leer-todas", { method: "PATCH" });
}
