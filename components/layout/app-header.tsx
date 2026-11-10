
import { Users, ShieldCheck } from "lucide-react";

type AppHeaderProps = {
  title: string;
  description: string;
  role?: "CAPITAN" | "ORGANIZADOR";
};

export function AppHeader({
  title,
  description,
  role = "CAPITAN",
}: AppHeaderProps) {
  const isOrganizer = role === "ORGANIZADOR";

  return (
    <header className="flex min-h-[96px] items-center justify-between border-b border-[#e1e8f0] bg-white px-7 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf3ff] text-[#1457c5]">
          {isOrganizer ? (
            <Users size={23} />
          ) : (
            <ShieldCheck size={23} />
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#172b4d] md:text-2xl">
            {title}
          </h1>

          <p className="mt-1 text-xs text-[#7184a3] md:text-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="hidden flex-col items-end gap-3 sm:flex">
        <span className="rounded-full bg-[#eaf3ff] px-4 py-1 text-[11px] font-semibold text-[#1457c5]">
          {isOrganizer ? "Organizador" : "Capitán"}
        </span>

        <span className="text-[10px] text-[#7184a3]">
          Liga Mayor Amateur · 2026
        </span>
      </div>
    </header>
  );
}
