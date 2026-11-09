"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient, createUnauthorizedGuard } from "./query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Ambos se crean una sola vez por pestaña del navegador.
  const [guard] = useState(() =>
    createUnauthorizedGuard(() => router.replace("/login")),
  );
  const [queryClient] = useState(() => createQueryClient(guard.handle));

  // Al llegar a /login (por sesión vencida o por cerrar sesión) se vacía la
  // caché, para que la siguiente persona que inicie sesión no vea datos de la
  // anterior, y se permite redirigir de nuevo en una sesión futura.
  useEffect(() => {
    if (pathname === "/login") {
      guard.reset();
      queryClient.clear();
    }
  }, [pathname, guard, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}