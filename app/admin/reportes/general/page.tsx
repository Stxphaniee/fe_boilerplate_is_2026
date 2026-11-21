import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SeasonGeneralStatsView } from "@/components/reports/season-stats-view";

function extractRoleFromToken(token: string): string {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return "";
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as {
      role?: unknown;
      rol?: unknown;
    };
    const rawRole = payload.role ?? payload.rol;
    return typeof rawRole === "string" ? rawRole : "";
  } catch {
    return "";
  }
}

export default async function SeasonGeneralStatsPage() {
  const token = await getSession();
  if (!token) {
    redirect("/login");
  }

  const role = extractRoleFromToken(token);
  return <SeasonGeneralStatsView role={role} />;
}
