
import type {
  MatchState,
} from "@/types/matches.types";

const styles: Record<MatchState, string> = {
  PROGRAMADO:
    "bg-blue-50 text-blue-700",

  EN_CURSO:
    "bg-emerald-100 text-emerald-700",

  FINALIZADO:
    "bg-slate-100 text-slate-700",

  SUSPENDIDO:
    "bg-amber-100 text-amber-800",

  CANCELADO:
    "bg-red-100 text-red-700",
};

export function ResultsStatus({
  state,
}: {
  state: MatchState;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${styles[state]}`}
    >
      {state === "EN_CURSO" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      )}

      {state.replace("_", " ")}
    </span>
  );
}
