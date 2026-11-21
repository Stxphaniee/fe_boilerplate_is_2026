"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStandings } from "@/lib/api/standings";
import { StandingsData } from "@/lib/types/standings";
import { Shield, ArrowRight } from "lucide-react";

export function StandingsCalculationView() {
  const [data, setData] = useState<StandingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStandings().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 text-center text-[#7184a3]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1457c5] border-r-transparent"></div>
        <p className="mt-2 text-sm">Cargando motor de cálculo de posiciones...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* 4 Tarjetas de Reglas de Puntuación */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Victoria */}
        <div className="bg-white rounded-xl border border-[#e1e8f0] p-5 shadow-sm border-l-4 border-l-[#1457c5]">
          <span className="text-xs text-[#7184a3] font-medium">Victoria</span>
          <p className="text-2xl md:text-3xl font-extrabold text-[#172b4d] mt-1">3 pts</p>
        </div>

        {/* Empate */}
        <div className="bg-white rounded-xl border border-[#e1e8f0] p-5 shadow-sm border-l-4 border-l-[#10b981]">
          <span className="text-xs text-[#7184a3] font-medium">Empate</span>
          <p className="text-2xl md:text-3xl font-extrabold text-[#172b4d] mt-1">1 pt</p>
        </div>

        {/* Derrota */}
        <div className="bg-white rounded-xl border border-[#e1e8f0] p-5 shadow-sm border-l-4 border-l-[#94a3b8]">
          <span className="text-xs text-[#7184a3] font-medium">Derrota</span>
          <p className="text-2xl md:text-3xl font-extrabold text-[#172b4d] mt-1">0 pts</p>
        </div>

        {/* PJ Válidos */}
        <div className="bg-white rounded-xl border border-[#e1e8f0] p-5 shadow-sm border-l-4 border-l-[#1e3a8a]">
          <span className="text-xs text-[#7184a3] font-medium">PJ válidos</span>
          <p className="text-xl md:text-2xl font-extrabold text-[#1e3a8a] mt-1">FINALIZADOS</p>
        </div>
      </div>

      {/* Tabla: Cálculo derivado de resultados oficiales */}
      <div className="bg-white rounded-xl border border-[#e1e8f0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f4f9] pb-4">
          <h2 className="text-base font-semibold text-[#172b4d]">Cálculo derivado de resultados oficiales</h2>
          <span className="text-xs text-[#7184a3]">{data.posiciones.length} equipos aprobados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e1e8f0] text-xs font-semibold text-[#7184a3] bg-[#f9fafc]">
                <th className="py-3 px-4">Equipo</th>
                <th className="py-3 px-4 text-center">PJ</th>
                <th className="py-3 px-4 text-center">PG</th>
                <th className="py-3 px-4 text-center">PE</th>
                <th className="py-3 px-4 text-center">PP</th>
                <th className="py-3 px-4 text-center">GF</th>
                <th className="py-3 px-4 text-center">GC</th>
                <th className="py-3 px-4 text-center">DG</th>
                <th className="py-3 px-4 text-center font-bold text-[#1457c5]">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {data.posiciones.map((team) => (
                <tr key={team.equipoId} className="hover:bg-[#f8faff] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#172b4d] flex items-center gap-2">
                    <Shield size={16} className="text-[#1457c5]" />
                    {team.nombre}
                  </td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.pj}</td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.pg}</td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.pe}</td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.pp}</td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.gf}</td>
                  <td className="py-3 px-4 text-center text-[#495057]">{team.gc}</td>
                  <td className="py-3 px-4 text-center font-medium">
                    <span className={team.dg > 0 ? "text-[#10b981]" : team.dg < 0 ? "text-[#ef4444]" : "text-[#7184a3]"}>
                      {team.dg > 0 ? `+${team.dg}` : team.dg}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-[#1457c5]">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reglas de Negocio Card */}
      <div className="bg-[#f0f7ff] rounded-xl border border-[#d0e4ff] p-5 text-sm space-y-2">
        <h3 className="font-bold text-[#1457c5] flex items-center gap-2">
          Reglas de negocio
        </h3>
        <p className="text-xs text-[#2d3748]">
          • Solo partidos <strong>FINALIZADOS</strong> de la temporada activa.
        </p>
        <p className="text-xs text-[#2d3748]">
          • Orden estricto de desempate: <strong>puntos → diferencia de goles → goles a favor → nombre alfabético</strong>.
        </p>
        <p className="text-xs text-[#2d3748]">
          • No existe edición manual de puntos ni modificación arbitraria de estadísticas (HTTP 403 Forbidden).
        </p>
      </div>

      {/* Botón inferior: Ver tabla pública */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-[#7184a3]">
          H10 · Lógica interna / GET /api/tabla-posiciones
        </span>
        <Link
          href="/tabla-posiciones"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1457c5] hover:bg-[#0f449e] text-white text-sm font-semibold shadow-sm transition-colors"
        >
          Ver tabla pública <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
