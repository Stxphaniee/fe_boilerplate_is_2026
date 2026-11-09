
"use client";

import Link from "next/link";

const navigation = [
  { label: "Inicio", icon: "▦", href: "/" },
  { label: "Mi Equipo", icon: "♟", href: "/equipos/inscripcion", active: true },
  { label: "Plantilla", icon: "♟", href: "/equipos/inscripcion#plantilla" },
  { label: "Calendario", icon: "▣", href: "#" },
  { label: "Resultados", icon: "◎", href: "#" },
  { label: "Tabla de posiciones", icon: "♜", href: "#" },
  { label: "Pagos", icon: "▣", href: "#" },
  { label: "Notificaciones", icon: "♧", href: "#" },
];

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[200px] flex-col bg-[#102342] text-white">
      <div className="flex h-[78px] items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xl">
          ◉
        </div>

        <div>
          <h2 className="text-sm font-bold">Liga Amateur</h2>
          <p className="text-[10px] text-slate-400">
            Gestión Deportiva
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-2 py-8">
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-3 text-[12px] transition-colors ${
              item.active
                ? "bg-[#294b7d] font-semibold text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="w-5 text-center text-base">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="m-3 rounded-lg border border-white/15 bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">♟</span>
          <div>
            <p className="text-xs font-semibold">Capitán</p>
            <p className="text-[10px] text-slate-400">
              Perfil de usuario
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
