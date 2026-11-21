
"use client";

import { useCurrentUserQuery } from "@/queries/auth/auth.queries";
import { useMyCalendarQuery } from "@/queries/calendar/calendar.queries";

import { isCalendarRole } from "@/types/auth.types";

import type {
  CalendarMatch,
  CalendarStats,
} from "@/types/calendar.types";

function calculateCalendarStats(
  matches: CalendarMatch[],
): CalendarStats {
  const firstMatch = matches[0];

  const teamName = firstMatch
    ? firstMatch.condicion === "LOCAL"
      ? firstMatch.equipoLocal.nombre
      : firstMatch.equipoVisitante.nombre
    : "Mi equipo";

  return {
    teamName,

    upcoming: matches.filter(
      (match) => match.estado === "PROGRAMADO",
    ).length,

    inProgress: matches.filter(
      (match) => match.estado === "EN_CURSO",
    ).length,

    finished: matches.filter(
      (match) => match.estado === "FINALIZADO",
    ).length,
  };
}

export function useMyCalendar() {
  const userQuery = useCurrentUserQuery();

  const user = userQuery.data;

  const role =
    !userQuery.isError &&
    user?.isActive &&
    isCalendarRole(user.role)
      ? user.role
      : null;

  const hasPermission = role !== null;

  const calendarQuery = useMyCalendarQuery(
    user?.id ?? "",
    hasPermission,
  );

  // No mostrar datos almacenados en caché cuando se
  // pierde el acceso al calendario.
  const matches =
    hasPermission && !calendarQuery.isError
      ? [...(calendarQuery.data ?? [])].sort(
          (first, second) =>
            new Date(first.fechaHoraInicio).getTime() -
            new Date(second.fechaHoraInicio).getTime(),
        )
      : [];

  const stats = calculateCalendarStats(matches);

  return {
    user,
    role,
    hasPermission,

    matches,
    stats,

    isUserLoading: userQuery.isPending,
    isUserError: userQuery.isError,
    userError: userQuery.error,
    refetchUser: userQuery.refetch,

    isCalendarLoading:
      hasPermission && calendarQuery.isPending,

    isCalendarError: calendarQuery.isError,

    calendarError: calendarQuery.error,

    isCalendarSuccess:
      hasPermission && calendarQuery.isSuccess,

    isRefreshing: calendarQuery.isFetching,

    updatedAt: calendarQuery.dataUpdatedAt,

    refetchCalendar: calendarQuery.refetch,
  };
}
