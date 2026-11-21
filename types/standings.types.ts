export interface StandingRow {
  posicion: number;
  equipoId: string;
  equipo: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
  estado?: string;
  esMiEquipo?: boolean;
}

export interface StandingsResponse {
  temporada?: string;
  actualizadoEn?: string;
  tabla: StandingRow[];
}
