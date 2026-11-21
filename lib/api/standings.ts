import { StandingsData } from "../types/standings";

const MOCK_STANDINGS: StandingsData = {
  temporada: "Liga Mayor Amateur · 2026",
  equiposAprobados: 8,
  partidosFinalizados: 20,
  lider: "Halcones FC",
  posiciones: [
    { posicion: 1, equipoId: "team-1", nombre: "Los Halcones FC", shortName: "HAL", pj: 5, pg: 4, pe: 1, pp: 0, gf: 12, gc: 4, dg: 8, pts: 13 },
    { posicion: 2, equipoId: "team-2", nombre: "Atlético Central", shortName: "ATC", pj: 5, pg: 3, pe: 1, pp: 1, gf: 10, gc: 6, dg: 4, pts: 10 },
    { posicion: 3, equipoId: "team-3", nombre: "Leones del Sur", shortName: "LEO", pj: 5, pg: 3, pe: 0, pp: 2, gf: 9, gc: 7, dg: 2, pts: 9 },
    { posicion: 4, equipoId: "team-4", nombre: "Deportivo Titanes", shortName: "TIT", pj: 5, pg: 2, pe: 1, pp: 2, gf: 7, gc: 8, dg: -1, pts: 7 },
    { posicion: 5, equipoId: "team-5", nombre: "Racing Norte", shortName: "RAC", pj: 5, pg: 1, pe: 2, pp: 2, gf: 6, gc: 8, dg: -2, pts: 5 },
    { posicion: 6, equipoId: "team-6", nombre: "Unión Sport", shortName: "UNI", pj: 5, pg: 1, pe: 1, pp: 3, gf: 5, gc: 10, dg: -5, pts: 4 },
  ],
};

export async function fetchStandings(): Promise<StandingsData> {
  try {
    const res = await fetch("/api/tabla-posiciones", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Modo autónomo / fallback
  }
  return MOCK_STANDINGS;
}
