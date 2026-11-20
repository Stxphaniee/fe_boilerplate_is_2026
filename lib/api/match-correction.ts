import { MatchCorrectionData, CorrectionPayload } from '../types/match-correction';

const MOCK_MATCH_CORRECTION: MatchCorrectionData = {
  id: 'match-default-1',
  jornadaNumero: 2,
  homeTeam: { id: 'team-halcones', name: 'Los Halcones FC' },
  awayTeam: { id: 'team-atletico', name: 'Atlético Central' },
  homeScore: 2,
  awayScore: 1,
  state: 'FINALIZADO',
  editableEvents: [
    {
      id: 'ev-1',
      minute: 18,
      playerId: 'player-diego',
      playerName: 'Diego Valdez',
      teamId: 'team-halcones',
      teamName: 'Halcones FC',
      type: 'Gol',
    },
    {
      id: 'ev-2',
      minute: 38,
      playerId: 'player-carlos',
      playerName: 'Carlos Duarte',
      teamId: 'team-atletico',
      teamName: 'Atlético Central',
      type: 'Gol',
    },
    {
      id: 'ev-3',
      minute: 67,
      playerId: 'player-diego',
      playerName: 'Diego Valdez',
      teamId: 'team-halcones',
      teamName: 'Halcones FC',
      type: 'Gol',
    },
  ],
  roster: [
    { id: 'player-diego', name: 'Diego Valdez', jerseyNumber: 10, teamId: 'team-halcones', teamName: 'Halcones FC' },
    { id: 'player-andres', name: 'Andrés Campos', jerseyNumber: 7, teamId: 'team-halcones', teamName: 'Halcones FC' },
    { id: 'player-javier', name: 'Javier Salinas', jerseyNumber: 9, teamId: 'team-halcones', teamName: 'Halcones FC' },
    { id: 'player-carlos', name: 'Carlos Duarte', jerseyNumber: 9, teamId: 'team-atletico', teamName: 'Atlético Central' },
    { id: 'player-mario', name: 'Mario Larios', jerseyNumber: 11, teamId: 'team-atletico', teamName: 'Atlético Central' },
    { id: 'player-luis', name: 'Luis Arias', jerseyNumber: 8, teamId: 'team-atletico', teamName: 'Atlético Central' },
  ],
};

export async function fetchMatchCorrection(id: string): Promise<MatchCorrectionData> {
  try {
    const res = await fetch(`/api/partidos/${id}/corregir`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline / mock fallback
  }
  return { ...MOCK_MATCH_CORRECTION, id };
}

export async function submitMatchCorrection(id: string, payload: CorrectionPayload): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/partidos/${id}/corregir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return { success: true, message: 'Corrección aplicada exitosamente con auditoría.' };
    }
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.message || 'Error al aplicar corrección.');
  } catch (err: any) {
    if (err.message && err.message !== 'Failed to fetch') {
      throw err;
    }
    // Si no hay backend conectado, simular éxito para pruebas autónomas
    return { success: true, message: 'Corrección aplicada en modo autónomo (simulada con éxito).' };
  }
}
