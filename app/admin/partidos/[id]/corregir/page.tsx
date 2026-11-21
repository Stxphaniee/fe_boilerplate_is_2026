import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MatchCorrectionView } from "@/components/matches/match-correction-view";

interface MatchCorrectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchCorrectionPage({ params }: MatchCorrectionPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-[#f5f8fd]">
      <AppSidebar role="ORGANIZADOR" />

      <div className="ml-[200px] min-h-screen flex flex-col">
        <AppHeader
          title="Corrección administrativa de resultados"
          description="Ajusta incidencias de goles de partidos finalizados con auditoría."
          role="ORGANIZADOR"
        />

        <main className="flex-1 pb-12">
          <MatchCorrectionView matchId={id} />
        </main>
      </div>
    </div>
  );
}
