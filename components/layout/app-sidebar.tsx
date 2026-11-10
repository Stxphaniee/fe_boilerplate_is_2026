
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Target,
  Trophy,
  Wallet,
  Bell,
  BarChart3,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";

type AppSidebarProps = {
  role?: "CAPITAN" | "ORGANIZADOR";
};

const captainNavigation = [
  {
    label: "Inicio",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Mi Equipo",
    icon: ShieldCheck,
    href: "/mi-equipo",
  },
  {
    label: "Inscribir equipo",
    icon: Users,
    href: "/equipos/inscripcion",
  },
  {
    label: "Calendario",
    icon: CalendarDays,
    href: "#",
  },
  {
    label: "Resultados",
    icon: Target,
    href: "#",
  },
  {
    label: "Tabla de posiciones",
    icon: Trophy,
    href: "#",
  },
  {
    label: "Pagos",
    icon: Wallet,
    href: "#",
  },
  {
    label: "Notificaciones",
    icon: Bell,
    href: "#",
  },
];

const organizerNavigation = [
  {
    label: "Inicio",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Inscripciones",
    icon: Users,
    href: "/admin/inscripciones",
  },
  {
    label: "Calendario",
    icon: CalendarDays,
    href: "#",
  },
  {
    label: "Resultados",
    icon: Target,
    href: "#",
  },
  {
    label: "Ranking",
    icon: Trophy,
    href: "#",
  },
  {
    label: "Pagos",
    icon: Wallet,
    href: "#",
  },
  {
    label: "Reportes",
    icon: BarChart3,
    href: "#",
  },
  {
    label: "Notificaciones",
    icon: Bell,
    href: "#",
  },
];

export function AppSidebar({
  role = "CAPITAN",
}: AppSidebarProps) {
  const pathname = usePathname();

  const isOrganizer = role === "ORGANIZADOR";

  const navigation = isOrganizer
    ? organizerNavigation
    : captainNavigation;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[200px] flex-col bg-[#102342] text-white">
      <div className="flex h-[78px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white">
          <ShieldCheck size={21} />
        </div>

        <div>
          <h2 className="text-sm font-bold">
            Liga Amateur
          </h2>

          <p className="text-[10px] text-slate-400">
            Gestión Deportiva
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-8">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href !== "#" &&
            (
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(`${item.href}/`))
            );

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-[12px] transition-colors ${
                active
                  ? "bg-[#294b7d] font-semibold text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg border border-white/15 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={21} />

          <div>
            <p className="text-xs font-semibold">
              {isOrganizer ? "Organizador" : "Capitán"}
            </p>

            <p className="text-[10px] text-slate-400">
              Perfil de usuario
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
