
"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import type { MatchResponse } from "@/types/matches.types";

const COURT_LABELS: Record<string, string> = {
  A: "A · Sintética",
  B: "B · Grama",
  C: "C · Techada",
};

interface RoundMatchesTableProps {
  matches: MatchResponse[];
  refereeNames: Record<string, string>;
  teamNames: Record<string, string>;
}

export function RoundMatchesTable({
  matches,
  refereeNames,
  teamNames,
}: RoundMatchesTableProps) {
  if (matches.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">
        No hay partidos programados en esta jornada.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Encuentro
            </th>

            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Fecha
            </th>

            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Cancha
            </th>

            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Árbitro
            </th>

            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Estado
            </th>

            <th className="px-4 py-3 text-left font-medium text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {matches.map((match) => {
            const localName =
              teamNames[match.equipoLocalId] ??
              match.equipoLocalId;

            const visitanteName =
              teamNames[match.equipoVisitanteId] ??
              match.equipoVisitanteId;

            const refereeName =
              refereeNames[match.arbitroId] ??
              match.arbitroId;

            const date = new Date(match.fechaHoraInicio);

            const dateLabel = date.toLocaleString("es-SV", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const canEdit =
              match.estado === "PROGRAMADO" ||
              match.estado === "SUSPENDIDO";

            return (
              <tr
                key={match.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3 font-semibold text-[#1a2b4a]">
                  {localName} vs {visitanteName}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {dateLabel}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {COURT_LABELS[match.cancha] ?? match.cancha}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {refereeName}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                    {match.estado}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {canEdit ? (
                    <Link
                      href={`/admin/partidos/${match.id}/editar?jornadaId=${encodeURIComponent(match.jornadaId)}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#cbd8e8] px-3 py-2 text-xs font-semibold text-[#1457c5] transition hover:border-[#1457c5] hover:bg-[#eaf3ff]"
                    >
                      <Pencil size={13} />
                      Editar
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400">
                      No editable
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
