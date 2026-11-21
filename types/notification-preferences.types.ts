export interface NotificationPreferences {
  pagos: boolean;
  calendario: boolean;
  resultados: boolean;
  inscripciones: boolean;
}

export type UpdateNotificationPreferencesRequest = Partial<NotificationPreferences>;
