"use client";

import { History } from "lucide-react";
import type { HistoryEntry } from "@/lib/useCalculationHistory";

export function HistoryList<TInputs>({
  history,
  onSelect,
}: {
  history: HistoryEntry<TInputs>[];
  onSelect: (inputs: TInputs) => void;
}) {
  if (history.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
        <History className="h-4 w-4" strokeWidth={1.75} />
        최근 계산 기록
      </div>
      <div className="mt-2 space-y-2">
        {history.map((entry) => (
          <button
            key={entry.timestamp}
            type="button"
            onClick={() => onSelect(entry.inputs)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-left text-sm transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <span className="text-zinc-700">{entry.summary}</span>
            <span className="shrink-0 text-xs text-zinc-400">다시 계산</span>
          </button>
        ))}
      </div>
    </div>
  );
}
