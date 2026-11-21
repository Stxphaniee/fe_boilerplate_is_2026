import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { MyPlayerStatsView } from "@/components/stats/my-player-stats-view";

export const metadata: Metadata = {
  title: "Mis estadísticas | Liga Amateur",
};

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

export default async function MyPlayerStatsPage() {
  const token = await getSession();
  if (!token) {
    redirect("/login");
  }

  const role = extractRoleFromToken(token);
  return <MyPlayerStatsView role={role} />;
}