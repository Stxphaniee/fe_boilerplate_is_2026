
import { AppSidebar } from "@/components/layout/app-sidebar";
import { RegistrationDashboard } from "@/components/teams/validation/registration-dashboard";

export default function RegistrationValidationPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fd]">
      <AppSidebar role="ORGANIZADOR" />

      <div className="ml-[200px] min-h-screen">
        <RegistrationDashboard />
      </div>
    </div>
  );
}
