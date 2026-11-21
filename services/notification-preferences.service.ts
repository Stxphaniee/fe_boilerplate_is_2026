import { apiRequest } from "@/lib/api/client";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesRequest,
} from "@/types/notification-preferences.types";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pagos: true,
  calendario: true,
  resultados: true,
  inscripciones: true,
};

function normalizePreferences(raw: unknown): NotificationPreferences {
  if (typeof raw !== "object" || raw === null) {
    return { ...DEFAULT_PREFERENCES };
  }
  const obj = raw as Record<string, unknown>;
  const source =
    typeof obj.preferences === "object" && obj.preferences !== null
      ? (obj.preferences as Record<string, unknown>)
      : typeof obj.data === "object" && obj.data !== null
        ? (obj.data as Record<string, unknown>)
        : obj;

  return {
    pagos: typeof source.pagos === "boolean" ? source.pagos : true,
    calendario: typeof source.calendario === "boolean" ? source.calendario : true,
    resultados: typeof source.resultados === "boolean" ? source.resultados : true,
    inscripciones:
      typeof source.inscripciones === "boolean" ? source.inscripciones : true,
  };
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const res = await apiRequest<unknown>("usuarios/preferencias-notificaciones", {
    method: "GET",
  });
  return normalizePreferences(res);
}

export async function updateNotificationPreferences(
  payload: UpdateNotificationPreferencesRequest,
): Promise<NotificationPreferences> {
  const res = await apiRequest<unknown>("usuarios/preferencias-notificaciones", {
    method: "PATCH",
    body: payload,
  });
  return normalizePreferences(res);
}
