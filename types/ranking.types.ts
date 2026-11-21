export type RankingCategory = "goles" | "asistencias" | "amarillas" | "rojas";

export interface RankedPlayerRow {
  posicion: number;
  jugadorId: string;
  jugadorNombre: string;
  equipoNombre: string;
  dorsal?: number;
  partidosJugados: number;
  valor: number;
}