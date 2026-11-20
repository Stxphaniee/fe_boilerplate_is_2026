
import type { ReactNode } from "react";

import {
  AppHeader,
} from "@/components/layout/app-header";

import {
  AppSidebar,
} from "@/components/layout/app-sidebar";

export function ResultsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar role="PUBLICO" />

      <div className="min-h-screen md:ml-[200px]">
        <AppHeader
          role="PUBLICO"
          title="Resultados públicos"
          description="Consulta marcadores oficiales y partidos en tiempo real sin iniciar sesión."
        />

        <main className="mx-auto w-full max-w-[1400px] space-y-4 p-4 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
