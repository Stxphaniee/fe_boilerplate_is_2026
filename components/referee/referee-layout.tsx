"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  AlertCircle,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

import {
  useCurrentUserQuery,
} from "@/queries/auth/auth.queries";

import {
  getErrorMessage,
} from "@/lib/api/errors";

interface RefereeLayoutProps {
  title: string;
  description: string;
  children: (userId: string) => ReactNode;
}

export function RefereeLayout({
  title,
  description,
  children,
}: RefereeLayoutProps) {
  const userQuery = useCurrentUserQuery();

  if (userQuery.isPending) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f8fc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d8e3f0] border-t-[#1457c5]" />

        <p className="text-sm text-[#7184a3]">
          Verificando sesión...
        </p>
      </main>
    );
  }

  if (userQuery.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] p-6">
        <section className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center">
          <AlertCircle
            size={32}
            className="mx-auto mb-4 text-red-500"
          />

          <h1 className="text-xl font-bold text-[#172b4d]">
            No fue posible verificar tu sesión
          </h1>

          <p className="mt-3 text-sm text-[#7184a3]">
            {getErrorMessage(userQuery.error)}
          </p>

          <button
            type="button"
            onClick={() =>
              void userQuery.refetch()
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1457c5] px-5 py-3 text-xs font-semibold text-white"
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  const user = userQuery.data;

  if (
    !user ||
    user.role !== "ARBITRO" ||
    !user.isActive
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f8fc] p-6">
        <section className="w-full max-w-md rounded-xl border border-[#d8e3f0] bg-white p-8 text-center">
          <ShieldCheck
            size={36}
            className="mx-auto mb-4 text-[#1457c5]"
          />

          <h1 className="text-xl font-bold text-[#172b4d]">
            Acceso no autorizado
          </h1>

          <p className="mt-3 text-sm text-[#7184a3]">
            Esta sección está disponible
            únicamente para árbitros activos.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#1457c5] px-5 py-3 text-xs font-semibold text-white"
          >
            Volver al inicio
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar role="ARBITRO" />

      <div className="ml-[200px] min-h-screen">
        <AppHeader
          title={title}
          description={description}
          role="ARBITRO"
        />

        <main className="mx-auto w-full max-w-[1400px] space-y-4 p-5 md:p-7">
          {children(user.id)}
        </main>
      </div>
    </div>
  );
}