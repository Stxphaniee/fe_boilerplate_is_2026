import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { StandingsCalculationView } from "@/components/standings/standings-calculation-view";

export default function StandingsCalculationPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fd]">
      <AppSidebar role="ORGANIZADOR" />

      <div className="ml-[200px] min-h-screen flex flex-col">
        <AppHeader
          title="Cálculo automático de posiciones"
          description="Representación visual del motor de cálculo, sin pantalla funcional propia."
          role="ORGANIZADOR"
        />

        <main className="flex-1 pb-12">
          <StandingsCalculationView />
        </main>
      </div>
    </div>
  );
}
