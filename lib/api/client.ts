import { ApiError, toApiError } from "./errors";
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
};

/**
 * Llamada a la API desde el navegador, a través del proxy `/api/*` de Next
 * (el navegador nunca ve el token). Solo para componentes de cliente: en el
 * servidor la URL relativa no funciona; allí se usa backendFetch.
 *
 * Devuelve el JSON de la respuesta y lanza ApiError ante cualquier fallo.
 */
export async function apiRequest<T>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {},
): Promise<T> {
  const hasBody = body !== undefined;

  let response: Response;
  try {
    response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
      cache: "no-store",
    });
  } catch (error) {
    // Una petición cancelada a propósito no es un error de red.
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new ApiError(
      0,
      "No se pudo conectar con el servidor. Revisa tu conexión.",
    );
  }

  const payload: unknown =
    response.status === 204
      ? undefined
      : await response.json().catch(() => undefined);

  // Ante un 401 el proxy ya borró la cookie de sesión; mandar al usuario a
  // /login lo hace el provider de TanStack Query (lib/providers), no esta capa.
  if (!response.ok) {
    throw toApiError(response.status, payload);
  }

  return payload as T;
}