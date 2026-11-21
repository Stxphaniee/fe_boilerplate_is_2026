import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { StandingsTableView } from "@/components/standings/standings-table-view";

export const metadata: Metadata = {
  title: "Tabla de posiciones | Liga Amateur",
};

function extractTeamIdFromToken(token?: string): string | undefined {
  if (!token) return undefined;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return undefined;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      teamId?: unknown;
      equipoId?: unknown;
    };
    const raw = payload.teamId ?? payload.equipoId;
    return typeof raw === "string" ? raw : undefined;
  } catch {
    return undefined;
  }
}

export default async function StandingsPage() {
  const token = await getSession();
  const highlightedTeamId = extractTeamIdFromToken(token);
  return <StandingsTableView highlightedTeamId={highlightedTeamId} />;
}
