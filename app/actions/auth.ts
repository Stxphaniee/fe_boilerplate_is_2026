"use server";

import { redirect } from "next/navigation";

import {
  createSession,
  deleteSession,
} from "@/lib/session";

import type {
  AuthUser,
  UserRole,
} from "@/types/auth.types";

export type LoginState = {
  error?: string;
  email?: string;
};

interface AuthenticationResult {
  token: string;
  role?: UserRole;
}

interface LoginApiResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  user?: AuthUser;
}

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
// AUTENTICACION CON EL BACKEND
// =====================================================

async function authenticate(
  email: string,
  password: string,
): Promise<AuthenticationResult | null> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error(
      "Falta la variable de entorno API_URL.",
    );
  }

  const res = await fetch(
    new URL(
      "auth/login",
      apiUrl.replace(/\/?$/, "/"),
    ),
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),

      cache: "no-store",
    },
  );

  if (
    res.status === 401 ||
    res.status === 403
  ) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `auth/login respondió ${res.status}`,
    );
  }

  const data: LoginApiResponse =
    await res.json();

  const token =
    data.token ??
    data.accessToken ??
    data.access_token;

  if (!token) {
    throw new Error(
      "La respuesta de auth/login no incluye un token.",
    );
  }

  return {
    token,
    role: data.user?.role,
  };
}

// =====================================================
// INICIO DE SESION
// =====================================================

export async function login(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(
    formData.get("email") ?? "",
  ).trim();

  const password = String(
    formData.get("password") ?? "",
  );

  if (!email || !password) {
    return {
      error: "Ingresa tu correo y contraseña.",
      email,
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      error: "Ingresa un correo válido.",
      email,
    };
  }

  let authentication:
    | AuthenticationResult
    | null;

  try {
    authentication = await authenticate(
      email,
      password,
    );
  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error,
    );

    return {
      error:
        "No se pudo iniciar sesión. Intenta más tarde.",
      email,
    };
  }

  if (!authentication) {
    return {
      error: "Correo o contraseña incorrectos.",
      email,
    };
  }

  // La sesion permanece en la cookie httpOnly.
  await createSession(
    authentication.token,
  );

  // HU6 - Calendario del jugador.
  if (authentication.role === "JUGADOR") {
    redirect("/mi-equipo/calendario");
  }

  // HU7 - Partidos asignados al arbitro.
  if (authentication.role === "ARBITRO") {
    redirect("/arbitro/partidos");
  }

  // Comportamiento existente de los demas roles.
  redirect("/equipos/inscripcion");
}

// =====================================================
// CIERRE DE SESION
// =====================================================

export async function logout() {
  await deleteSession();

  redirect("/login");
}