import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications.service";
import type { NotificationFilter } from "@/types/notifications.types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, filter: NotificationFilter) =>
    [...notificationKeys.all, "list", page, filter] as const,
};

/** Bandeja paginada; se refresca cada 5 s para recibir avisos nuevos. */
export function useNotificationsQuery(page: number, filter: NotificationFilter) {
  return useQuery({
    queryKey: notificationKeys.list(page, filter),
    queryFn: () => getNotifications(page, filter),
    placeholderData: keepPreviousData,
    refetchInterval: 5_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
