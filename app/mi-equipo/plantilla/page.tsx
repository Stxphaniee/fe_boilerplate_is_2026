import { AppSidebar } from "@/components/layout/app-sidebar";
import { RosterManagementView } from "@/components/teams/roster-management-view";


export default function RosterManagementPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fd]">
      <AppSidebar role="CAPITAN" />

      <div className="ml-[200px] min-h-screen">
        <RosterManagementView />
      </div>
    </div>
  );
}