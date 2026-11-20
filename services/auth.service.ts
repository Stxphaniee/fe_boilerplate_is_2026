
import { apiRequest } from "@/lib/api/client";

import type { AuthUser } from "@/types/auth.types";

/**
 * Consulta el usuario autenticado.
 * GET /api/v1/auth/me
 */
export async function getCurrentUser(
  signal?: AbortSignal,
): Promise<AuthUser> {
  return apiRequest<AuthUser>("auth/me", {
    method: "GET",
    signal,
  });
}
