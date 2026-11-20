export interface StandingsPositionItem {
  posicion: number;
  equipoId: string;
  nombre: string;
  shortName: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface StandingsData {
  temporada: string;
  equiposAprobados: number;
  partidosFinalizados: number;
  lider: string;
  posiciones: StandingsPositionItem[];
}
