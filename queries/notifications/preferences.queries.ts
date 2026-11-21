import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/services/notification-preferences.service";
import type { UpdateNotificationPreferencesRequest } from "@/types/notification-preferences.types";

export const notificationPreferencesKeys = {
  all: ["notification-preferences"] as const,
};

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryKey: notificationPreferencesKeys.all,
    queryFn: getNotificationPreferences,
    retry: false,
  });
}

export function useUpdateNotificationPreferencesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesRequest) =>
      updateNotificationPreferences(payload),
    onSuccess: (updated) => {
      qc.setQueryData(notificationPreferencesKeys.all, updated);
    },
  });
}
