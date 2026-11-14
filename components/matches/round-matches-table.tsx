'use client';

import type { MatchResponse } from '@/types/matches.types';

const COURT_LABELS: Record<string, string> = {
  A: 'A · Sintética',
  B: 'B · Grama',
  C: 'C · Techada',
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

            const dateLabel = date.toLocaleString('es-SV', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });

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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}