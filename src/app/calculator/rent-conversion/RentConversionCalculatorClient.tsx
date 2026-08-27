"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  calculateRentConversion,
  legalConversionRateCap,
  type ConversionDirection,
  type RentConversionResult,
} from "@/lib/calculators/rentConversion";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface RentConversionInputs {
  direction: ConversionDirection;
  baseDeposit: string;
  reducedDeposit: string;
  monthlyRent: string;
  conversionRate: string;
}

export default function RentConversionCalculatorClient() {
  const [direction, setDirection] = useState<ConversionDirection>("jeonseToMonthly");
  const [baseDeposit, setBaseDeposit] = useState("300,000,000");
  const [reducedDeposit, setReducedDeposit] = useState("100,000,000");
  const [monthlyRent, setMonthlyRent] = useState("750,000");
  const [conversionRate, setConversionRate] = useState("4.5");
  const [result, setResult] = useState<RentConversionResult | null>(null);
  const { history, addEntry } =
    useCalculationHistory<RentConversionInputs>("rent-conversion");

  function runCalculation(inputs: RentConversionInputs) {
    const base = Number(inputs.baseDeposit.replace(/[^0-9]/g, ""));
    const reduced = Number(inputs.reducedDeposit.replace(/[^0-9]/g, ""));
    const rent = Number(inputs.monthlyRent.replace(/[^0-9]/g, ""));
    const rate = Number(inputs.conversionRate);
    if (!base || base <= 0 || rate <= 0) return;

    const calcResult = calculateRentConversion({
      direction: inputs.direction,
      baseDeposit: base,
      reducedDeposit: reduced,
      monthlyRent: rent,
      conversionRatePercent: rate,
    });
    setResult(calcResult);
    addEntry(
      inputs.direction === "jeonseToMonthly"
        ? `전세 ${formatWon(base)} → 월세 ${formatWon(calcResult.monthlyRent)}`
        : `월세 ${formatWon(rent)} → 환산 전세 ${formatWon(calcResult.convertedJeonseDeposit)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({ direction, baseDeposit, reducedDeposit, monthlyRent, conversionRate });
  }

  function handleSelectHistory(inputs: RentConversionInputs) {
    setDirection(inputs.direction);
    setBaseDeposit(inputs.baseDeposit);
    setReducedDeposit(inputs.reducedDeposit);
    setMonthlyRent(inputs.monthlyRent);
    setConversionRate(inputs.conversionRate);
    runCalculation(inputs);
  }

  const legalCap = legalConversionRateCap(2.5);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <ArrowLeftRight className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">전월세 전환 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        전세보증금과 월세 사이를 법정 전환율 기준으로 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">전환 방향</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDirection("jeonseToMonthly")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                direction === "jeonseToMonthly"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              전세 → 월세
            </button>
            <button
              type="button"
              onClick={() => setDirection("monthlyToJeonse")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                direction === "monthlyToJeonse"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              월세 → 전세 환산
            </button>
          </div>
        </div>

        {direction === "jeonseToMonthly" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                전세보증금 (원)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={baseDeposit}
                onChange={(e) => setBaseDeposit(formatNumberInput(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="예: 300,000,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                전환 후 보증금 (원)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={reducedDeposit}
                onChange={(e) => setReducedDeposit(formatNumberInput(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="예: 100,000,000"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                월세보증금 (원)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={baseDeposit}
                onChange={(e) => setBaseDeposit(formatNumberInput(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="예: 100,000,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">월세 (원)</label>
              <input
                type="text"
                inputMode="numeric"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(formatNumberInput(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                placeholder="예: 750,000"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            전환율 (연 %)
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={conversionRate}
            onChange={(e) => setConversionRate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <p className="mt-1 text-xs text-zinc-400">
            참고: 한국은행 기준금리 2.50% 기준 현재 법정 상한 전환율은 약{" "}
            {legalCap}%입니다. 기준금리가 바뀌면 상한도 달라집니다.
          </p>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-zinc-900 py-3 font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
        >
          계산하기
        </button>
      </form>

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm animate-result-in">
          <div className="bg-zinc-950 px-6 py-6 text-center">
            {direction === "jeonseToMonthly" ? (
              <>
                <p className="text-sm text-amber-400">예상 월세</p>
                <p className="mt-1 font-display text-3xl font-bold text-white">
                  <CountUpNumber value={result.monthlyRent} formatter={formatWon} />
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-amber-400">환산 전세보증금</p>
                <p className="mt-1 font-display text-3xl font-bold text-white">
                  <CountUpNumber
                    value={result.convertedJeonseDeposit}
                    formatter={formatWon}
                  />
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <HistoryList history={history} onSelect={handleSelectHistory} />

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          전월세 전환은 어떻게 계산되나요?
        </h2>
        <p>
          전세보증금을 낮추고 그만큼을 월세로 돌릴 때,{" "}
          <strong>월세 = (낮춘 보증금) × 전환율 ÷ 12</strong>로 계산합니다.
          반대로 월세를 전세로 환산할 때는{" "}
          <strong>환산 전세보증금 = 월세보증금 + (월세 × 12 ÷ 전환율)</strong>
          을 사용합니다.
        </p>
        <p>
          주택임대차보호법 시행령에 따라 <strong>기존 계약을 갱신·전환</strong>
          할 때 적용하는 전환율은 &quot;한국은행 기준금리 + 2%p&quot;와{" "}
          <strong>연 10%</strong> 중 낮은 금액을 초과할 수 없습니다. 다만 이
          상한은 신규 계약에는 강제되지 않으며, 당사자 간 협의로 다른 전환율을
          정할 수 있습니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              전환율은 누가 정하나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              신규 계약은 임대인과 임차인이 자유롭게 협의해서 정합니다. 다만
              기존 계약을 갱신하면서 보증금 일부를 월세로 바꾸는 경우에는
              법정 상한(기준금리+2%p, 최대 10%)을 넘길 수 없습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              법정 상한을 넘는 월세를 요구받으면 어떻게 하나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              갱신 계약에서 법정 상한을 초과한 부분은 무효이며, 이미 지급한
              초과분은 반환을 청구할 수 있습니다. 자세한 사항은 주택임대차
              분쟁조정위원회 등을 통해 확인해보세요.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              기준금리가 바뀌면 이미 계약한 월세도 바뀌나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              아니요. 법정 상한은 계약 체결·갱신 시점에 적용되는 기준이며,
              계약 기간 중 기준금리가 바뀐다고 해서 이미 정해진 월세가
              자동으로 조정되지는 않습니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 주택임대차보호법 시행령 제9조 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.law.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국가법령정보센터
          </a>
          ,{" "}
          <a
            href="https://www.hug.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            주택도시보증공사
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 계약 조건과 차이가 발생할 수 있습니다. 법정 상한 관련 정확한
          판단은 관련 기관 또는 전문가를 통해 확인해 주세요.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
