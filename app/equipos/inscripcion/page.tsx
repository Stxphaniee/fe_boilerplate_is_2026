
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { TeamRegistrationForm } from "@/components/teams/team-registration-form";

export default function InscripcionPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fc]">
      <AppSidebar />

      <div className="min-h-screen pl-[200px]">
        <AppHeader
          title="Inscripción de equipo y plantilla"
          description="Inscríbete en la liga y registra la información de tu plantilla."
        />

        <main className="mx-auto w-full max-w-[1450px] space-y-5 p-5 md:p-7">
          <TeamRegistrationForm />
        </main>
      </div>
    </div>
  );
}
