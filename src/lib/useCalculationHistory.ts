"use client";

import { useEffect, useState } from "react";

export interface HistoryEntry<TInputs> {
  timestamp: number;
  summary: string;
  inputs: TInputs;
}

const MAX_ENTRIES = 3;

function storageKey(calculatorKey: string): string {
  return `reko:history:${calculatorKey}`;
}

function readHistory<TInputs>(calculatorKey: string): HistoryEntry<TInputs>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(calculatorKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCalculationHistory<TInputs>(calculatorKey: string) {
  const [history, setHistory] = useState<HistoryEntry<TInputs>[]>([]);

  useEffect(() => {
    setHistory(readHistory<TInputs>(calculatorKey));
  }, [calculatorKey]);

  function addEntry(summary: string, inputs: TInputs) {
    const next = [{ timestamp: Date.now(), summary, inputs }, ...history].slice(
      0,
      MAX_ENTRIES
    );
    setHistory(next);
    try {
      window.localStorage.setItem(storageKey(calculatorKey), JSON.stringify(next));
    } catch {
      // localStorage 사용 불가(시크릿 모드 등) 시 조용히 무시
    }
  }

  return { history, addEntry };
}
