"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, CreditCard, Lock } from "lucide-react";
import { getErrorMessage } from "@/lib/api/errors";
import { payRegistrationFee } from "@/services/payments.service";
import type { PaymentReceipt } from "@/types/payments.types";

const FIXED_AMOUNT = 50.0;

export function RegistrationPaymentView({ role }: { role: string }) {
  const isCaptain = role.toUpperCase() === "CAPITAN";
  const [titular, setTitular] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  if (!isCaptain) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          <p className="font-semibold">Acceso restringido (403)</p>
          <p className="mt-1">Solo el rol Capitán puede realizar el pago de la cuota de inscripción.</p>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) {
      setErrorMsg("Ingresa un número de tarjeta válido.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiracion.trim())) {
      setErrorMsg("Usa el formato MM/AA para la fecha de vencimiento.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv.trim())) {
      setErrorMsg("Ingresa un CVV válido de 3 o 4 dígitos.");
      return;
    }

    const last4 = digits.slice(-4);
    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (last4 === "0002") {
        setErrorMsg("Fondos insuficientes");
        return;
      }

      const result = await payRegistrationFee({
        ultimos4: last4,
        titular: titular.trim(),
        expiracion: expiracion.trim(),
        monto: FIXED_AMOUNT,
      });

      setCardNumber("");
      setCvv("");
      setReceipt(result);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fe] text-[#1457c5]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#172b4d]">Pago de cuota de inscripción</h1>
              <p className="text-sm text-[#64748b]">Pasarela simulada segura. No se almacena el PAN completo ni el CVV.</p>
            </div>
          </div>
          <div className="rounded-lg bg-[#eff6ff] px-4 py-2 text-right">
            <p className="text-xs font-medium text-[#64748b]">Cuota fija</p>
            <p className="text-xl font-bold text-[#1457c5]">${FIXED_AMOUNT.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {receipt ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="h-6 w-6" />
            <h2 className="text-lg font-bold">Pago confirmado</h2>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-emerald-700">Comprobante</dt>
              <dd className="font-semibold text-[#172b4d]">{receipt.comprobanteId}</dd>
            </div>
            <div>
              <dt className="text-xs text-emerald-700">Tarjeta</dt>
              <dd className="font-semibold text-[#172b4d]">**** **** **** {receipt.ultimos4}</dd>
            </div>
            <div>
              <dt className="text-xs text-emerald-700">Monto pagado</dt>
              <dd className="font-semibold text-[#172b4d]">${receipt.monto.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xs text-emerald-700">Fecha de pago</dt>
              <dd className="font-semibold text-[#172b4d]">{new Date(receipt.fechaPago).toLocaleString("es-SV")}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          {errorMsg && (
            <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#334155]">Titular de la tarjeta</label>
            <input
              type="text"
              required
              value={titular}
              onChange={(e) => setTitular(e.target.value)}
              placeholder="Nombre completo"
              className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155]">Número de tarjeta</label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242 (aprueba) / ...0002 (rechaza)"
              className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155]">Vencimiento (MM/AA)</label>
              <input
                type="text"
                required
                value={expiracion}
                onChange={(e) => setExpiracion(e.target.value)}
                placeholder="12/28"
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155]">CVV</label>
              <input
                type="password"
                inputMode="numeric"
                required
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1457c5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0f46a3] disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {processing ? "Procesando pago..." : `Pagar $${FIXED_AMOUNT.toFixed(2)}`}
          </button>
        </form>
      )}
    </main>
  );
}