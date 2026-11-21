import { apiRequest } from '@/lib/api/client';

/**
* POST /api/v1/partidos/:id/notificar-cambio (HU16)
* Sends a notification about a match change.
*/
export function notifyMatchChange(matchId: number, change: string, userId: number) {
return apiRequest(`partidos/${matchId}/notificar-cambio`, {
method: 'POST',
body: { change, userId },
});
}
