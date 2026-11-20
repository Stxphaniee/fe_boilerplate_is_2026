
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  SESSION_COOKIE,
} from "@/lib/session";

// =====================================================
// RUTAS PUBLICAS
// =====================================================

const publicRoutes = ["/login"];

/**
 * HU8:
 * Permite consultar resultados sin iniciar sesión.
 *
 * No habilita otras rutas privadas de la aplicación.
 */
function isPublicResultsRoute(
  pathname: string,
): boolean {
  return (
    pathname === "/resultados" ||
    pathname.startsWith("/resultados/")
  );
}

// =====================================================
// PROXY DE AUTENTICACION
// =====================================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    isPublicResultsRoute(pathname);

  const hasSession = Boolean(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  // Las rutas privadas requieren sesión.
  if (!isPublicRoute && !hasSession) {
    return NextResponse.redirect(
      new URL("/login", request.nextUrl),
    );
  }

  // Un usuario autenticado no necesita entrar al login.
  // Los resultados sí son accesibles con o sin sesión.
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(
      new URL("/", request.nextUrl),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
