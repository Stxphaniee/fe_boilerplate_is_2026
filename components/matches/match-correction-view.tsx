"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchMatchCorrection, submitMatchCorrection } from "@/lib/api/match-correction";
import { EditableGoalEvent, MatchCorrectionData } from "@/lib/types/match-correction";
import { Trash2, Plus, AlertCircle, CheckCircle2, Pencil, Check, X } from "lucide-react";

export function MatchCorrectionView({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [data, setData] = useState<MatchCorrectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [events, setEvents] = useState<EditableGoalEvent[]>([]);
  const [justification, setJustification] = useState("");
  const [newPlayerId, setNewPlayerId] = useState("");
  const [newMinute, setNewMinute] = useState<number>(45);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlayerId, setEditPlayerId] = useState("");
  const [editMinute, setEditMinute] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);

    fetchMatchCorrection(matchId)
      .then((res) => {
        if (!active) return;
        setData(res);
        setEvents(res.editableEvents ?? []);
        if (res.roster && res.roster.length > 0) {
          setNewPlayerId(res.roster[0].id);
        }
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof Error && err.message
            ? err.message
            : "No se pudo cargar la información del partido para corrección.";
        setLoadError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [matchId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-[#7184a3]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1457c5] border-r-transparent" />
        <p className="mt-2 text-sm">Cargando incidencias del partido...</p>
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="p-4 rounded-xl flex items-start justify-between gap-4 bg-[#fdedec] border border-[#f5b7b1] text-[#922b21]">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">
              {loadError ?? "No se encontró el partido solicitado."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => router.push("/resultados")}
            className="px-3 py-1.5 rounded-lg border border-[#e6b0aa] bg-white text-xs font-semibold text-[#922b21] hover:bg-[#fdf2f2]"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const homePlayerIds = new Set(
    data.roster.filter((p) => p.teamId === data.homeTeam.id).map((p) => p.id),
  );

  let calculatedHomeScore = 0;
  let calculatedAwayScore = 0;

  for (const ev of events) {
    if (homePlayerIds.has(ev.playerId) || ev.teamId === data.homeTeam.id) {
      calculatedHomeScore += 1;
    } else {
      calculatedAwayScore += 1;
    }
  }

  const handleRemoveEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleStartEdit = (ev: EditableGoalEvent) => {
    setEditingId(ev.id);
    setEditPlayerId(ev.playerId);
    setEditMinute(ev.minute);
  };

  const handleSaveEdit = (id: string) => {
    const player = data.roster.find((p) => p.id === editPlayerId);
    if (!player) return;

    const parsedMin = Number(editMinute);
    if (!Number.isFinite(parsedMin) || parsedMin < 0 || parsedMin > 120) {
      setFeedback({ type: "error", message: "El minuto debe estar entre 0 y 120." });
      return;
    }

    setFeedback(null);
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? {
              ...ev,
              minute: parsedMin,
              playerId: player.id,
              playerName: player.name,
              teamId: player.teamId,
              teamName: player.teamName,
              type: "Gol",
            }
          : ev,
      ),
    );
    setEditingId(null);
  };

  const handleAddEvent = () => {
    if (!newPlayerId) return;
    const player = data.roster.find((p) => p.id === newPlayerId);
    if (!player) return;

    const parsedMin = Number(newMinute);
    if (!Number.isFinite(parsedMin) || parsedMin < 0 || parsedMin > 120) {
      setFeedback({ type: "error", message: "El minuto debe estar entre 0 y 120." });
      return;
    }

    setFeedback(null);
    const newEv: EditableGoalEvent = {
      id: `ev-new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      minute: parsedMin,
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      teamName: player.teamName,
      type: "Gol",
    };

    setEvents((prev) => [...prev, newEv]);
  };

  const handleSubmit = async () => {
    const trimmedJustification = justification.trim();
    if (!trimmedJustification) {
      setFeedback({ type: "error", message: "La justificación es obligatoria." });
      return;
    }
    if (trimmedJustification.length > 300) {
      setFeedback({
        type: "error",
        message: "La justificación no debe superar los 300 caracteres.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const res = await submitMatchCorrection(matchId, {
        justificacion: trimmedJustification,
        eventosCorregidos: events.map((e) => ({
          playerId: e.playerId,
          minute: e.minute,
          type: "GOL",
        })),
      });

      setFeedback({ type: "success", message: res.message });
      setTimeout(() => {
        router.push("/resultados");
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Error al aplicar la corrección.";
      setFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-[#eaf9f0] border border-[#a6e5ba] text-[#1c6a38]"
              : "bg-[#fdedec] border border-[#f5b7b1] text-[#922b21]"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-medium">{feedback.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#e1e8f0] p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f0f4f9] pb-4 mb-4">
          <h2 className="text-base font-semibold text-[#172b4d]">Resultado oficial</h2>
          <span className="bg-[#eaf9f0] text-[#1c6a38] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {data.state}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center justify-center gap-8 md:gap-16 w-full max-w-2xl">
            <div className="flex-1 text-right">
              <span className="text-lg md:text-xl font-bold text-[#172b4d]">
                {data.homeTeam.name}
              </span>
            </div>

            <div className="flex items-center gap-4 bg-[#f5f8fd] px-6 py-2 rounded-xl border border-[#e1e8f0]">
              <span className="text-3xl md:text-4xl font-extrabold text-[#1457c5]">
                {calculatedHomeScore}
              </span>
              <span className="text-xl font-light text-[#7184a3]">—</span>
              <span className="text-3xl md:text-4xl font-extrabold text-[#1457c5]">
                {calculatedAwayScore}
              </span>
            </div>

            <div className="flex-1 text-left">
              <span className="text-lg md:text-xl font-bold text-[#172b4d]">
                {data.awayTeam.name}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#7184a3]">
            Jornada {String(data.jornadaNumero).padStart(2, "0")} · resultado sujeto a justificación
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e1e8f0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f4f9] pb-4">
          <h2 className="text-base font-semibold text-[#172b4d]">Eventos de gol editables</h2>
          <span className="text-xs text-[#7184a3]">
            {events.length} {events.length === 1 ? "gol registrado" : "goles registrados"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#e1e8f0] text-xs font-semibold text-[#7184a3] bg-[#f9fafc]">
                <th className="py-3 px-4">Min.</th>
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-4">Equipo</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f9]">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7184a3] text-sm">
                    No hay goles registrados para este encuentro.
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const isEditing = editingId === ev.id;
                  return (
                    <tr key={ev.id} className="hover:bg-[#f8faff] transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#172b4d]">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={120}
                            value={editMinute}
                            onChange={(e) => setEditMinute(Number(e.target.value))}
                            className="w-16 text-xs border border-[#ced4da] rounded-lg px-2 py-1 bg-white text-[#172b4d]"
                          />
                        ) : (
                          `${ev.minute}'`
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#172b4d]">
                        {isEditing ? (
                          <select
                            value={editPlayerId}
                            onChange={(e) => setEditPlayerId(e.target.value)}
                            className="text-xs border border-[#ced4da] rounded-lg px-2 py-1 bg-white text-[#172b4d]"
                          >
                            {data.roster.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.jerseyNumber} {p.name} ({p.teamName})
                              </option>
                            ))}
                          </select>
                        ) : (
                          ev.playerName
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#7184a3]">{ev.teamName}</td>
                      <td className="py-3 px-4">
                        <span className="bg-[#eaf3ff] text-[#1457c5] font-semibold text-xs px-2.5 py-0.5 rounded-full">
                          Gol
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(ev.id)}
                                className="inline-flex items-center gap-1 text-xs text-[#1457c5] hover:text-[#0f449e] font-medium"
                              >
                                <Check size={14} /> Guardar
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="inline-flex items-center gap-1 text-xs text-[#7184a3] hover:text-[#172b4d] font-medium"
                              >
                                <X size={14} /> Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(ev)}
                                className="inline-flex items-center gap-1 text-xs text-[#1457c5] hover:text-[#0f449e] font-medium transition-colors"
                              >
                                <Pencil size={14} /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveEvent(ev.id)}
                                className="inline-flex items-center gap-1 text-xs text-[#d32f2f] hover:text-[#b71c1c] font-medium transition-colors"
                              >
                                <Trash2 size={14} /> Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-[#f0f4f9] bg-[#fbfcfd] p-4 rounded-lg flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-[#172b4d]">Agregar incidencia:</span>
          <select
            value={newPlayerId}
            onChange={(e) => setNewPlayerId(e.target.value)}
            className="text-xs border border-[#ced4da] rounded-lg px-3 py-2 bg-white text-[#172b4d] focus:outline-none focus:border-[#1457c5]"
          >
            {data.roster.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.jerseyNumber} {p.name} ({p.teamName})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <span className="text-xs text-[#7184a3]">Min:</span>
            <input
              type="number"
              min={0}
              max={120}
              value={newMinute}
              onChange={(e) => setNewMinute(Number(e.target.value))}
              className="w-16 text-xs border border-[#ced4da] rounded-lg px-2 py-2 bg-white text-[#172b4d] focus:outline-none focus:border-[#1457c5]"
            />
          </div>

          <button
            type="button"
            onClick={handleAddEvent}
            className="inline-flex items-center gap-1 bg-[#eaf3ff] hover:bg-[#d6e7ff] text-[#1457c5] font-medium text-xs px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={14} /> Agregar gol
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e1e8f0] p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="justificacion" className="text-sm font-semibold text-[#172b4d]">
            Justificación obligatoria (máx. 300 caracteres) *
          </label>
          <span
            className={`text-xs ${
              justification.length > 300 ? "text-[#d32f2f] font-bold" : "text-[#7184a3]"
            }`}
          >
            {justification.length} / 300
          </span>
        </div>

        <textarea
          id="justificacion"
          rows={3}
          value={justification}
          onChange={(e) => setJustification(e.target.value)}
          placeholder="Describa el motivo formal de la corrección administrativa..."
          maxLength={300}
          className="w-full text-sm border border-[#ced4da] rounded-xl p-3 text-[#172b4d] placeholder-[#a0aec0] focus:outline-none focus:border-[#1457c5] focus:ring-1 focus:ring-[#1457c5]"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/resultados")}
          className="px-5 py-2.5 rounded-xl border border-[#ced4da] bg-white text-sm font-medium text-[#495057] hover:bg-[#f8f9fa] transition-colors"
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={saving || !justification.trim() || justification.length > 300}
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-[#1457c5] hover:bg-[#0f449e] disabled:bg-[#a0c0f0] text-white text-sm font-semibold shadow-sm transition-colors"
        >
          {saving ? "Aplicando..." : "Aplicar corrección"}
        </button>
      </div>
    </div>
  );
}