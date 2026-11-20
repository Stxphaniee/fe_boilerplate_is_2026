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
  ImageIcon,
  Radio,
} from "lucide-react";

type AppSidebarProps = {
  role?:
    | "CAPITAN"
    | "ORGANIZADOR"
    | "JUGADOR"
    | "ARBITRO";
};

const ROLE_LABELS = {
  CAPITAN: "Capitán",
  ORGANIZADOR: "Organizador",
  JUGADOR: "Jugador",
  ARBITRO: "Árbitro",
} as const;

// =====================================================
// NAVEGACION DEL CAPITAN
// =====================================================

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
    href: "/mi-equipo/calendario",
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

// =====================================================
// NAVEGACION DEL ORGANIZADOR
// =====================================================

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
    href: "/admin/partidos/nuevo",
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

// =====================================================
// NAVEGACION DEL JUGADOR - HU6
// =====================================================

const playerNavigation = [
  {
    label: "Inicio",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Calendario",
    icon: CalendarDays,
    href: "/mi-equipo/calendario",
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
    label: "Estadísticas",
    icon: BarChart3,
    href: "#",
  },
  {
    label: "Galería",
    icon: ImageIcon,
    href: "#",
  },
  {
    label: "Notificaciones",
    icon: Bell,
    href: "#",
  },
];

// =====================================================
// NAVEGACION DEL ARBITRO - HU7
// =====================================================

function getRefereeNavigation(
  currentMatchPath: string,
) {
  return [
    {
      label: "Inicio",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      label: "Mis partidos",
      icon: CalendarDays,
      href: "/arbitro/partidos",
    },
    {
      label: "Marcador en vivo",
      icon: Radio,
      href: currentMatchPath,
    },
    {
      label: "Resultados",
      icon: Target,
      href: "#",
    },
    {
      label: "Notificaciones",
      icon: Bell,
      href: "#",
    },
  ];
}

// =====================================================
// SIDEBAR PRINCIPAL
// =====================================================

export function AppSidebar({
  role = "CAPITAN",
}: AppSidebarProps) {
  const pathname = usePathname();

  const isOrganizer =
    role === "ORGANIZADOR";

  const isRefereePanel =
    pathname.startsWith(
      "/arbitro/partidos/",
    );

  const isPersonalCalendarRoute =
    pathname === "/mi-equipo/calendario" ||
    pathname.startsWith(
      "/mi-equipo/calendario/",
    );

  const navigation =
    role === "ORGANIZADOR"
      ? organizerNavigation
      : role === "JUGADOR"
        ? playerNavigation
        : role === "ARBITRO"
          ? getRefereeNavigation(
              isRefereePanel
                ? pathname
                : "/arbitro/partidos",
            )
          : captainNavigation;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[200px] flex-col bg-[#102342] text-white">

      {/* Identidad de la liga */}
      <div className="flex h-[78px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white">
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

      {/* Navegacion por rol */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-2 py-8">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isOrganizerMatchesRoute =
            isOrganizer &&
            item.label === "Calendario" &&
            pathname.startsWith(
              "/admin/partidos",
            );

          const isExcludedTeamRoute =
            item.href === "/mi-equipo" &&
            isPersonalCalendarRoute;

          let active =
            !isExcludedTeamRoute &&
            (
              isOrganizerMatchesRoute ||
              (
                item.href !== "#" &&
                (
                  pathname === item.href ||
                  (
                    item.href !== "/" &&
                    pathname.startsWith(
                      `${item.href}/`,
                    )
                  )
                )
              )
            );

          // Distinguir la lista del arbitro
          // de su panel de control.
          if (
            role === "ARBITRO" &&
            item.label === "Mis partidos"
          ) {
            active =
              pathname === "/arbitro/partidos";
          }

          if (
            role === "ARBITRO" &&
            item.label === "Marcador en vivo"
          ) {
            active = isRefereePanel;
          }

          const itemClassName =
            `flex items-center gap-3 rounded-md px-3 py-3 text-[12px] transition-colors ${
              active
                ? "bg-[#294b7d] font-semibold text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`;

          // Funcionalidades pendientes.
          if (
            (
              role === "JUGADOR" ||
              role === "ARBITRO"
            ) &&
            item.href === "#"
          ) {
            return (
              <span
                key={item.label}
                aria-disabled="true"
                title="Funcionalidad próximamente disponible"
                className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-3 text-[12px] text-slate-300 opacity-70"
              >
                <Icon
                  size={17}
                  className="shrink-0"
                />

                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className={itemClassName}
            >
              <Icon
                size={17}
                className="shrink-0"
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Perfil del usuario */}
      <div className="m-3 rounded-lg border border-white/15 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <ClipboardCheck size={21} />

          <div>
            <p className="text-xs font-semibold">
              {ROLE_LABELS[role]}
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