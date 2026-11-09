import "server-only";
import { getSession } from "@/lib/session";

function apiBaseUrl(): string {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("Falta la variable de entorno API_URL.");
  }
  // Termina siempre en "/" para que new URL() conserve el prefijo (/api/v1).
  return `${apiUrl.replace(/\/+$/, "")}/`;
}

/**
 * fetch al backend con el token de la sesión. Solo para código de servidor
 * (Route Handlers, Server Components y Server Actions).
 *
 * `path` es relativo a API_URL, sin "/" inicial: "teams", "auth/me".
 * Si no hay sesión devuelve un 401 sin llamar al backend.
 */
export async function backendFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = await getSession();
  if (!token) {
    return Response.json(
      { statusCode: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(new URL(path.replace(/^\/+/, ""), apiBaseUrl()), {
    ...init,
    headers,
    cache: "no-store",
  });
}