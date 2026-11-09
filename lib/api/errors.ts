/** Error de una llamada a la API, ya normalizado para mostrarlo en pantalla. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Todos los mensajes que devolvió el backend (validación suele traer varios). */
    readonly details: string[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "Revisa los datos ingresados.",
  401: "Tu sesión expiró. Inicia sesión de nuevo.",
  403: "No tienes permiso para realizar esta acción.",
  404: "No se encontró lo que buscas.",
  409: "La acción no se puede completar en el estado actual.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Convierte el cuerpo de error de NestJS ({ statusCode, message, error }) en un
 * ApiError. `message` puede ser un texto o una lista de textos (validación).
 */
export function toApiError(status: number, body: unknown): ApiError {
  const raw = isRecord(body) ? body.message : undefined;
  const details = Array.isArray(raw)
    ? raw.filter((item): item is string => typeof item === "string")
    : [];
  const fromBackend = typeof raw === "string" ? raw : details[0];

  const fallback =
    status >= 500
      ? "Ocurrió un error en el servidor. Intenta más tarde."
      : (DEFAULT_MESSAGES[status] ?? "No se pudo completar la solicitud.");

  // El 401 siempre usa el texto propio: el del backend viene en inglés.
  const message = status === 401 ? fallback : (fromBackend ?? fallback);
  return new ApiError(status, message, details);
}

/** Texto listo para mostrar al usuario a partir de cualquier error capturado. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudo completar la solicitud. Intenta de nuevo.";
}