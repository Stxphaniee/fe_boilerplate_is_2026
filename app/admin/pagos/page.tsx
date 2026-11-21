import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminPaymentsView } from "@/components/payments/admin-payments-view";

export const metadata: Metadata = {
  title: "Gestión de pagos | Liga Amateur",
};

function extractRoleFromToken(token: string): string {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return "";
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as { role?: unknown; rol?: unknown };
    const raw = payload.role ?? payload.rol;
    return typeof raw === "string" ? raw : "";
  } catch {
    return "";
  }
}

export default async function AdminPaymentsPage() {
  const token = await getSession();
  if (!token) redirect("/login");
  return <AdminPaymentsView role={extractRoleFromToken(token)} />;
}