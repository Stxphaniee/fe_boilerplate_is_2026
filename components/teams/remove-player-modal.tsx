"use client";

interface RemovePlayerModalProps {
  playerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function RemovePlayerModal({
  playerName,
  onConfirm,
  onCancel,
  isLoading,
}: RemovePlayerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-semibold text-[#1a2b4a] mb-2">
          ¿Dar de baja a este jugador?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Estás por dar de baja a{" "}
          <span className="font-semibold text-[#1a2b4a]">{playerName}</span>.
          Esta acción no elimina su historial de partidos.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Procesando..." : "Confirmar baja"}
          </button>
        </div>
      </div>
    </div>
  );
}