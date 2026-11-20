"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  MatchClock,
  RefereePanel,
} from "@/types/referee.types";

const MATCH_DURATION_SECONDS = 90 * 60;

function parseDate(
  value: string | null | undefined,
): number | null {
  if (!value) return null;

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

function formatElapsed(
  seconds: number,
): string {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export function useMatchClock(
  panel: RefereePanel | undefined,
  receivedAt: number,
): MatchClock {
  const [now, setNow] = useState(
    () => Date.now(),
  );

  const isRunning =
    panel?.estado === "EN_CURSO" &&
    Boolean(panel.inicioReal);

  // Actualizacion visual local cada segundo.
  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(
      () => setNow(Date.now()),
      1_000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  const actualStart = parseDate(
    panel?.inicioReal,
  );

  const actualEnd = parseDate(
    panel?.finReal,
  );

  const serverNow = parseDate(
    panel?.servidorAhora,
  );

  let elapsedSeconds: number | null = null;

  // Partido pendiente de iniciar.
  if (panel?.estado === "PROGRAMADO") {
    elapsedSeconds = 0;
  }

  // Partido en curso.
  if (
    panel?.estado === "EN_CURSO" &&
    actualStart !== null &&
    serverNow !== null
  ) {
    const elapsedAtResponse = Math.max(
      0,
      serverNow - actualStart,
    );

    const elapsedSinceResponse = receivedAt
      ? Math.max(0, now - receivedAt)
      : 0;

    elapsedSeconds = Math.floor(
      (
        elapsedAtResponse +
        elapsedSinceResponse
      ) / 1_000,
    );
  }

  // Partido finalizado.
  if (
    panel?.estado === "FINALIZADO" &&
    actualStart !== null &&
    actualEnd !== null
  ) {
    elapsedSeconds = Math.floor(
      Math.max(
        0,
        actualEnd - actualStart,
      ) / 1_000,
    );
  }

  return {
    elapsedSeconds,

    minute:
      elapsedSeconds === null
        ? null
        : Math.floor(elapsedSeconds / 60),

    display:
      elapsedSeconds === null
        ? "--:--"
        : formatElapsed(elapsedSeconds),

    isRunning,

    progress:
      elapsedSeconds === null
        ? 0
        : Math.min(
            100,
            (elapsedSeconds /
              MATCH_DURATION_SECONDS) *
              100,
          ),
  };
}