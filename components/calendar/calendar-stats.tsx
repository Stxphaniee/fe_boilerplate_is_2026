
import type {
  CalendarStats as CalendarStatsData,
} from "@/types/calendar.types";

interface CalendarStatsProps {
  stats: CalendarStatsData;
  isLoading?: boolean;
  hasData: boolean;
}

export function CalendarStats({
  stats,
  isLoading = false,
  hasData,
}: CalendarStatsProps) {
  const cards = [
    {
      label: "Equipo",
      value: stats.teamName,
      accent: "#1457c5",
    },
    {
      label: "Próximos",
      value: String(stats.upcoming).padStart(2, "0"),
      accent: "#16a085",
    },
    {
      label: "En curso",
      value: String(stats.inProgress).padStart(2, "0"),
      accent: "#8794bd",
    },
    {
      label: "Finalizados",
      value: String(stats.finished).padStart(2, "0"),
      accent: "#d99a18",
    },
  ];

  return (
    <section
      aria-label="Resumen del calendario"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="flex min-h-[106px] min-w-0 items-center gap-3 rounded-xl border border-[#d8e3f0] bg-white p-4"
        >
          <div
            aria-hidden="true"
            className="h-12 w-[4px] shrink-0 rounded-full"
            style={{
              backgroundColor: card.accent,
            }}
          />

          <div className="min-w-0">
            <p className="text-xs font-medium text-[#7184a3]">
              {card.label}
            </p>

            {isLoading ? (
              <div className="mt-3 h-6 w-20 animate-pulse rounded-md bg-[#eaf0f8]" />
            ) : (
              <p
                className="mt-2 truncate text-xl font-bold text-[#172b4d]"
                title={hasData ? card.value : undefined}
              >
                {hasData ? card.value : "—"}
              </p>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}
