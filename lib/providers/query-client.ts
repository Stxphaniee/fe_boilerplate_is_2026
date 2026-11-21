import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/errors";

const MAX_RETRIES = 2;

// Un 4xx no se arregla reintentando: sesión vencida, sin permiso, no existe,
// datos inválidos o conflicto de estado.
function isClientError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

/**
 * Crea el QueryClient de la app. Es una función pura (sin React ni Next) para
 * poder probarla sola.
 *
 * `onUnauthorized` se llama cada vez que una consulta o una mutación recibe un
 * 401, o sea, cuando la sesión venció o el token ya no sirve.
 */
export function createQueryClient(onUnauthorized: () => void): QueryClient {
  const handleError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      onUnauthorized();
    }
  };

  return new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        retry: (failureCount, error) =>
          !isClientError(error) && failureCount < MAX_RETRIES,
      },
    },
  });
}

/**
 * Evita redirigir varias veces seguidas. Varias consultas a la vez (por
 * ejemplo, el polling) pueden fallar juntas con 401 y deben producir una sola
 * redirección. `reset` vuelve a habilitarla cuando el usuario llega a /login.
 */
export function createUnauthorizedGuard(redirect: () => void) {
  let redirecting = false;
  return {
    handle() {
      if (redirecting) return;
      redirecting = true;
      redirect();
    },
    reset() {
      redirecting = false;
    },
  };
}