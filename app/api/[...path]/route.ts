
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  backendFetch,
} from "@/lib/api/server";

import {
  deleteSession,
} from "@/lib/session";

type ApiRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

// =====================================================
// CONFIGURACION HTTP
// =====================================================

const NO_BODY_STATUS = [204, 205, 304];

const METHODS_WITHOUT_BODY = [
  "GET",
  "HEAD",
  "DELETE",
];

function jsonError(
  status: number,
  message: string,
) {
  return NextResponse.json(
    {
      statusCode: status,
      message,
    },
    {
      status,
    },
  );
}

// =====================================================
// RUTAS PERMITIDAS POR EL PROXY
// =====================================================

/**
 * El login, refresh y logout se manejan
 * mediante las Server Actions existentes.
 *
 * auth/me continúa disponible para los
 * componentes de cliente.
 */
function isAllowed(path: string): boolean {
  const normalized = path.toLowerCase();

  if (normalized === "auth/me") {
    return true;
  }

  return (
    normalized !== "auth" &&
    !normalized.startsWith("auth/")
  );
}

// =====================================================
// HU8 - CONSULTAS PUBLICAS
// =====================================================

/**
 * Únicamente los siguientes GET pueden
 * realizarse sin sesión:
 *
 * GET partidos/resultados
 * GET partidos/:uuid
 *
 * Las demás solicitudes mantienen
 * la autenticación existente.
 */
function isPublicResultsGet(
  method: string,
  path: string,
): boolean {
  const idPattern =
    /^partidos\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  return (
    method === "GET" &&
    (
      path === "partidos/resultados" ||
      idPattern.test(path)
    )
  );
}

// =====================================================
// PROXY HACIA EL BACKEND
// =====================================================

async function forward(
  request: NextRequest,
  ctx: ApiRouteContext,
) {
  const { path: segments } = await ctx.params;

  // Evitar segmentos peligrosos.
  const isUnsafe = (segment: string) =>
    segment === "" ||
    segment === "." ||
    segment === ".." ||
    segment.includes("/") ||
    segment.includes("\\");

  if (segments.some(isUnsafe)) {
    return jsonError(
      400,
      "Ruta inválida.",
    );
  }

  const path = segments
    .map(encodeURIComponent)
    .join("/");

  if (!isAllowed(path)) {
    return jsonError(
      404,
      "Ruta no disponible.",
    );
  }

  // Solo se reenvían los headers necesarios.
  const headers = new Headers({
    Accept: "application/json",
  });

  const contentType =
    request.headers.get("content-type");

  if (contentType) {
    headers.set(
      "Content-Type",
      contentType,
    );
  }

  const hasBody =
    !METHODS_WITHOUT_BODY.includes(
      request.method,
    );

  const isPublicGet =
    isPublicResultsGet(
      request.method,
      path,
    );

  let upstream: Response;

  try {
    if (isPublicGet) {
      // =================================================
      // HU8 - CONSULTA SIN AUTENTICACION
      // =================================================

      const apiUrl = process.env.API_URL;

      if (!apiUrl) {
        throw new Error(
          "Falta API_URL",
        );
      }

      upstream = await fetch(
        new URL(
          `${path}${request.nextUrl.search}`,
          `${apiUrl.replace(/\/+$/, "")}/`,
        ),
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },

          cache: "no-store",
        },
      );
    } else {
      // =================================================
      // RUTAS PRIVADAS EXISTENTES
      // =================================================

      upstream = await backendFetch(
        `${path}${request.nextUrl.search}`,
        {
          method: request.method,
          headers,

          body: hasBody
            ? await request.text()
            : undefined,
        },
      );
    }
  } catch (error) {
    console.error(
      "No se pudo conectar con el backend:",
      error,
    );

    return jsonError(
      502,
      "No se pudo conectar con el servidor.",
    );
  }

  // Limpiar la sesión únicamente cuando
  // falle una solicitud privada.
  if (
    upstream.status === 401 &&
    !isPublicGet
  ) {
    await deleteSession();
  }

  // =====================================================
  // RESPUESTA HACIA EL CLIENTE
  // =====================================================

  const responseHeaders = new Headers();

  const upstreamType =
    upstream.headers.get("content-type");

  if (upstreamType) {
    responseHeaders.set(
      "Content-Type",
      upstreamType,
    );
  }

  return new NextResponse(
    NO_BODY_STATUS.includes(
      upstream.status,
    )
      ? null
      : upstream.body,
    {
      status: upstream.status,
      headers: responseHeaders,
    },
  );
}

// =====================================================
// EXPORTACIONES HTTP EXISTENTES
// =====================================================

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
