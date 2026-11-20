
import { CalendarDays } from "lucide-react";

import type {
  CalendarMatch,
} from "@/types/calendar.types";

import type {
  MatchState,
} from "@/types/matches.types";

interface CalendarMatchesTableProps {
  matches: CalendarMatch[];
  teamName: string;
}

const STATUS_STYLES: Record<MatchState, string> = {
  PROGRAMADO:
    "bg-[#e7f1ff] text-[#1457c5]",

  EN_CURSO:
    "bg-amber-100 text-amber-800",

  FINALIZADO:
    "bg-[#dcf5e8] text-[#16834a]",

  SUSPENDIDO:
    "bg-[#fce7e9] text-[#dc3545]",

  CANCELADO:
    "bg-slate-100 text-slate-600",
};

function formatMatchDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  const day = date.toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/El_Salvador",
  });

  const time = date.toLocaleTimeString("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "America/El_Salvador",
  });

  return `${day} · ${time}`;
}

function MatchStatusBadge({
  status,
}: {
  status: MatchState;
}) {
  return (
    <span
      className={`inline-flex min-w-[110px] items-center justify-center rounded-full px-3 py-1.5 text-[10px] font-bold ${
        STATUS_STYLES[status] ??
        "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

export function CalendarMatchesTable({
  matches,
  teamName,
}: CalendarMatchesTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white">
      <header className="border-b border-[#d8e3f0] bg-[#eaf3ff] px-5 py-3.5">
        <h2 className="text-sm font-bold text-[#172b4d]">
          {teamName === "Mi equipo"
            ? "Partidos de mi equipo"
            : `Partidos de ${teamName}`}
        </h2>
      </header>

      {matches.length === 0 ? (
        <div className="flex min-h-[285px] flex-col items-center justify-center px-5 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf3ff] text-[#1457c5]">
            <CalendarDays size={26} />
          </div>

          <h3 className="text-sm font-semibold text-[#172b4d]">
            Tu equipo no tiene partidos programados
          </h3>

          <p className="mt-2 max-w-md text-xs leading-5 text-[#7184a3]">
            Los encuentros aparecerán aquí cuando el
            organizador publique una jornada en la que
            participe tu equipo.
          </p>
        </div>
      ) : (
        <div className="min-h-[285px] overflow-x-auto p-3">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead>
              <tr className="bg-[#f3f7fc] text-[#7184a3]">
                <th
                  scope="col"
                  className="rounded-l-md px-3 py-3 font-medium"
                >
                  Jornada
                </th>

                <th
                  scope="col"
                  className="px-3 py-3 font-medium"
                >
                  Encuentro
                </th>

                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3 font-medium"
                >
                  Fecha / hora
                </th>

                <th
                  scope="col"
                  className="px-3 py-3 font-medium"
                >
                  Cancha
                </th>

                <th
                  scope="col"
                  className="rounded-r-md px-3 py-3 font-medium"
                >
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>
              {matches.map((match) => (
                <tr
                  key={match.id}
                  className="border-b border-[#e5edf6] text-[#243858] transition-colors hover:bg-[#f8fafd]"
                >
                  <td className="whitespace-nowrap px-3 py-4 font-semibold">
                    J{String(match.jornada).padStart(2, "0")}
                  </td>

                  <td className="px-3 py-4">
                    <p className="font-medium">
                      {match.equipoLocal.nombre}
                      {" vs "}
                      {match.equipoVisitante.nombre}
                    </p>

                    <p className="mt-1 text-[10px] text-[#7184a3]">
                      Rival: {match.rival.nombre}
                      {" · "}
                      {match.condicion === "LOCAL"
                        ? "Local"
                        : "Visitante"}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-3 py-4">
                    {formatMatchDateTime(
                      match.fechaHoraInicio,
                    )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4">
                    Cancha {match.cancha}
                  </td>

                  <td className="px-3 py-4">
                    <MatchStatusBadge
                      status={match.estado}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
