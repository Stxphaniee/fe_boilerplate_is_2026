import { AppSidebar } from "@/components/layout/app-sidebar";
import { MatchSchedulingView } from "@/components/matches/match-scheduling-view";

export default function MatchSchedulingPage() {
  return (
    <div className="min-h-screen bg-[#f5f8fd]">

      <AppSidebar role="ORGANIZADOR" />

      <div className="ml-[200px] min-h-screen">
        <MatchSchedulingView />
      </div>

    </div>
  );
}