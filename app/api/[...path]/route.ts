import { NextResponse, type NextRequest } from "next/server";
import { backendFetch } from "@/lib/api/server";
import { deleteSession } from "@/lib/session";

type ApiRouteContext = {
  params: Promise<{
    path: string[];
  }>;
};
// Proxy hacia el backend NestJS. El navegador no puede leer la cookie httpOnly
// con el token, así que sus llamadas pasan por acá: este handler lee la cookie
// en el servidor y reenvía la petición con el header Authorization.

// Respuestas sin cuerpo según HTTP: construir un Response con cuerpo fallaría.
const NO_BODY_STATUS = [204, 205, 304];
const METHODS_WITHOUT_BODY = ["GET", "HEAD", "DELETE"];

function jsonError(status: number, message: string) {
  return NextResponse.json({ statusCode: status, message }, { status });
}

// El login, el refresh y el logout se manejan solo con las Server Actions:
// así los tokens nunca pasan por el JavaScript del navegador. Solo se deja
// `auth/me`. Express no distingue mayúsculas en las rutas, por eso se
// compara en minúsculas.
function isAllowed(path: string): boolean {
  const normalized = path.toLowerCase();
  if (normalized === "auth/me") return true;
  return normalized !== "auth" && !normalized.startsWith("auth/");
}

async function forward(request: NextRequest, ctx: ApiRouteContext) {
  const { path: segments } = await ctx.params;

  // Evita salirse del prefijo de la API: sin "..", ".", segmentos vacíos ni
  // barras escondidas dentro de un segmento (%2F), que ya llegan decodificadas.
  const isUnsafe = (segment: string) =>
    segment === "" ||
    segment === "." ||
    segment === ".." ||
    segment.includes("/") ||
    segment.includes("\\");
  if (segments.some(isUnsafe)) {
    return jsonError(400, "Ruta inválida.");
  }
  const path = segments.map(encodeURIComponent).join("/");
  if (!isAllowed(path)) {
    return jsonError(404, "Ruta no disponible.");
  }

  // Solo se reenvían los headers necesarios; la cookie de sesión nunca viaja.
  const headers = new Headers({ Accept: "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const hasBody = !METHODS_WITHOUT_BODY.includes(request.method);

  let upstream: Response;
  try {
    upstream = await backendFetch(`${path}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
    });
  } catch (error) {
    console.error("No se pudo conectar con el backend:", error);
    return jsonError(502, "No se pudo conectar con el servidor.");
  }

  // Token vencido o inválido: se borra la sesión. El cliente redirige a /login.
  if (upstream.status === 401) {
    await deleteSession();
  }

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("Content-Type", upstreamType);

  return new NextResponse(
    NO_BODY_STATUS.includes(upstream.status) ? null : upstream.body,
    { status: upstream.status, headers: responseHeaders },
  );
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
