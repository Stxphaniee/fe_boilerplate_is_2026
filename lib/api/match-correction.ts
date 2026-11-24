import { apiRequest } from "@/lib/api/client";
import { MatchCorrectionData, CorrectionPayload } from "@/lib/types/match-correction";

export async function fetchMatchCorrection(
  id: string,
): Promise<MatchCorrectionData> {
  return apiRequest<MatchCorrectionData>(`partidos/${encodeURIComponent(id)}/corregir`);
}

export async function submitMatchCorrection(
  id: string,
  payload: CorrectionPayload,
): Promise<{ success: boolean; message: string }> {
  await apiRequest<unknown>(`partidos/${encodeURIComponent(id)}/corregir`, {
    method: "POST",
    body: payload,
  });

  return {
    success: true,
    message: "Corrección aplicada exitosamente con auditoría.",
  };
}