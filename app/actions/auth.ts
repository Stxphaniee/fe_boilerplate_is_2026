
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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// =====================================================
// AUTENTICACIÓN CON EL BACKEND
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

  if (res.status === 401 || res.status === 403) {
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `auth/login respondió ${res.status}`,
    );
  }

  const data: LoginApiResponse = await res.json();

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
// INICIO DE SESIÓN
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

  let authentication: AuthenticationResult | null;

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
      error:
        "Correo o contraseña incorrectos.",
      email,
    };
  }

  // El token continúa almacenándose exclusivamente
  // en la cookie httpOnly del servidor.
  await createSession(authentication.token);

  // HU6 - Los jugadores ingresan directamente
  // al calendario de partidos de su equipo.
  if (authentication.role === "JUGADOR") {
    redirect("/mi-equipo/calendario");
  }

  // Conservamos el comportamiento anterior
  // para los demás roles.
  redirect("/equipos/inscripcion");
}

// =====================================================
// CIERRE DE SESIÓN
// =====================================================

export async function logout() {
  await deleteSession();

  redirect("/login");
}
