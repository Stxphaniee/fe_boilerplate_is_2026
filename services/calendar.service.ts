
import { apiRequest } from "@/lib/api/client";

import type {
  CalendarMatch,
} from "@/types/calendar.types";

/**
 * HU6 - Consulta del calendario del equipo autenticado.
 *
 * GET /api/v1/equipos/mis-partidos
 *
 * El backend identifica el equipo mediante la sesión.
 * No se envían IDs de equipos ni usuarios desde el cliente.
 */
export async function getMyCalendar(
  signal?: AbortSignal,
): Promise<CalendarMatch[]> {
  return apiRequest<CalendarMatch[]>(
    "equipos/mis-partidos",
    {
      method: "GET",
      signal,
    },
  );
}
