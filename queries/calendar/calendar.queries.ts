
"use client";

import { useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/errors";
import { getMyCalendar } from "@/services/calendar.service";

export const CALENDAR_REFRESH_INTERVAL = 5_000;

export const calendarKeys = {
  all: ["calendar"] as const,

  mine: (userId: string) =>
    [...calendarKeys.all, "mine", userId] as const,
};

/**
 * HU6 - Calendario del usuario autenticado.
 *
 * Actualiza la información cada cinco segundos mientras
 * la pantalla se encuentra visible.
 */
export function useMyCalendarQuery(
  userId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: calendarKeys.mine(userId),

    queryFn: ({ signal }) =>
      getMyCalendar(signal),

    enabled: enabled && Boolean(userId),

    staleTime: 0,

    retry: false,

    refetchOnMount: "always",

    refetchOnWindowFocus: true,

    refetchOnReconnect: true,

    refetchIntervalInBackground: false,

    refetchInterval: (query) => {
      const error = query.state.error;

      // Evitar consultas repetitivas ante errores
      // definitivos de autenticación o permisos.
      if (
        error instanceof ApiError &&
        [401, 403, 404].includes(error.status)
      ) {
        return false;
      }

      return CALENDAR_REFRESH_INTERVAL;
    },
  });
}
