
import type {
  ResultMatch,
} from "@/types/results.types";

import {
  matchesToday,
} from "@/types/results.types";

interface ResultsStatsProps {
  matches: ResultMatch[];
  loading?: boolean;
}

export function ResultsStats({
  matches,
  loading = false,
}: ResultsStatsProps) {
  const cards = [
    {
      label: "Partidos hoy",
      value: matchesToday(matches),
      color: "#1457c5",
    },
    {
      label: "En curso",
      value: matches.filter(
        (match) => match.estado === "EN_CURSO",
      ).length,
      color: "#16a085",
    },
    {
      label: "Finalizados",
      value: matches.filter(
        (match) => match.estado === "FINALIZADO",
      ).length,
      color: "#8794bd",
    },
    {
      label: "Programados",
      value: matches.filter(
        (match) => match.estado === "PROGRAMADO",
      ).length,
      color: "#d99a18",
    },
  ];

  return (
    <section
      aria-label="Resumen de partidos"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex min-h-[100px] items-center gap-3 rounded-xl border border-[#d8e3f0] bg-white p-4"
        >
          <span
            aria-hidden="true"
            className="h-11 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: card.color,
            }}
          />

          <div>
            <p className="text-xs text-[#7184a3]">
              {card.label}
            </p>

            <p className="mt-2 text-xl font-bold tabular-nums text-[#172b4d]">
              {loading
                ? "—"
                : String(card.value).padStart(2, "0")}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
