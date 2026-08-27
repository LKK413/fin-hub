"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import {
  calculateSavings,
  type SavingsMode,
  type InterestType,
  type SavingsResult,
} from "@/lib/calculators/savings";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface SavingsInputs {
  mode: SavingsMode;
  amount: string;
  annualRate: string;
  months: string;
  interestType: InterestType;
}

export default function SavingsCalculatorClient() {
  const [mode, setMode] = useState<SavingsMode>("installment");
  const [amount, setAmount] = useState("500,000");
  const [annualRate, setAnnualRate] = useState("3.5");
  const [months, setMonths] = useState("12");
  const [interestType, setInterestType] = useState<InterestType>("simple");
  const [result, setResult] = useState<SavingsResult | null>(null);
  const { history, addEntry } = useCalculationHistory<SavingsInputs>("savings");

  function runCalculation(inputs: SavingsInputs) {
    const amt = Number(inputs.amount.replace(/[^0-9]/g, ""));
    const rate = Number(inputs.annualRate);
    const m = Math.round(Number(inputs.months));
    if (!amt || amt <= 0 || m <= 0 || rate < 0) return;

    const calcResult = calculateSavings({
      mode: inputs.mode,
      amount: amt,
      annualRatePercent: rate,
      months: m,
      interestType: inputs.interestType,
    });
    setResult(calcResult);
    addEntry(
      `${inputs.mode === "lumpsum" ? "예금" : "적금"} ${formatWon(amt)}${
        inputs.mode === "installment" ? "/월" : ""
      }, 연 ${inputs.annualRate}%, ${inputs.months}개월 → 세후 ${formatWon(calcResult.netTotal)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({ mode, amount, annualRate, months, interestType });
  }

  function handleSelectHistory(inputs: SavingsInputs) {
    setMode(inputs.mode);
    setAmount(inputs.amount);
    setAnnualRate(inputs.annualRate);
    setMonths(inputs.months);
    setInterestType(inputs.interestType);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Coins className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">예금·적금 이자 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        단리·복리 방식별 세전·세후 이자와 만기 수령액을 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            저축 방식
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("installment")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                mode === "installment"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              적금 (매월 납입)
            </button>
            <button
              type="button"
              onClick={() => setMode("lumpsum")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                mode === "lumpsum"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              예금 (거치식)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            {mode === "lumpsum" ? "예치 원금 (원)" : "월 납입액 (원)"}
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(formatNumberInput(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder={mode === "lumpsum" ? "예: 10,000,000" : "예: 500,000"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              연 이자율 (%)
            </label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              기간 (개월)
            </label>
            <input
              type="number"
              min={1}
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            이자 계산 방식
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInterestType("simple")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                interestType === "simple"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              단리
            </button>
            <button
              type="button"
              onClick={() => setInterestType("compound")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                interestType === "compound"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              월복리
            </button>
          </div>
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
            <p className="text-sm text-amber-400">세후 만기 수령액</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.netTotal} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              세전 이자 {formatWon(result.grossInterest)}
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">
                    {mode === "lumpsum" ? "예치 원금" : "총 납입액"}
                  </td>
                  <td className="py-2 text-right">
                    {formatWon(result.totalDeposit)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">세전 이자</td>
                  <td className="py-2 text-right">
                    {formatWon(result.grossInterest)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">이자소득세 (15.4%)</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.tax)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-200 font-medium">
                  <td className="py-2">세후 이자</td>
                  <td className="py-2 text-right">
                    {formatWon(result.netInterest)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <HistoryList history={history} onSelect={handleSelectHistory} />

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          이자는 어떻게 계산되나요?
        </h2>
        <p>
          <strong>예금(거치식)</strong>은 목돈을 한 번에 넣고 만기까지 두는
          방식이고, <strong>적금(적립식)</strong>은 매월 일정 금액을 나눠
          납입하는 방식입니다. 적금은 먼저 납입한 회차일수록 이자가 붙는
          기간이 길어서, 같은 총 납입액이라도 예금보다 세전 이자가 적게
          계산됩니다.
        </p>
        <p>
          <strong>단리</strong>는 원금(또는 매회 납입액)에 대해서만 이자가
          붙고, <strong>복리</strong>는 발생한 이자가 원금에 합산되어 다음
          기간의 이자 계산에 다시 포함됩니다. 이 계산기의 복리는 월 단위로
          이자가 재투자되는 월복리를 가정합니다.
        </p>
        <p>
          이자소득에는 이자소득세 14%와 지방소득세 1.4%를 더한{" "}
          <strong>15.4%</strong>가 원천징수됩니다. 세후 이자는 세전 이자에서
          이 세금을 뺀 금액입니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              예금과 적금 중 이자가 더 많은 건 어느 쪽인가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              같은 금액을 같은 기간 굴린다면 예금(거치식)이 이자가 더
              많습니다. 적금은 매월 나눠 넣기 때문에 평균적으로 원금이 굴러가는
              기간이 예금보다 짧아 세전 이자가 더 적게 계산됩니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              단리와 복리 차이가 실제로 얼마나 나나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              예치 기간이 짧으면 차이가 크지 않지만, 기간이 길어질수록 복리의
              이자가 단리보다 눈에 띄게 커집니다. 시중 예·적금 상품은 대부분
              1년 이하 단기이므로 실제 차이는 미미한 경우가 많습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              이자소득세가 안 붙는 경우도 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              청년우대형 청약통장, 조합 출자금 등 세금우대·비과세 혜택이 있는
              특정 상품은 15.4%보다 낮은 세율이 적용되거나 비과세될 수
              있습니다. 이 계산기는 일반과세(15.4%) 기준입니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              은행 계산 결과와 왜 조금 다른가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              은행마다 이자 계산 기준일, 우대금리 적용 조건, 세금 반올림
              방식이 조금씩 달라 실제 수령액과 오차가 있을 수 있습니다. 이
              계산기는 표준적인 계산식을 기준으로 한 참고용 추정치입니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 이자소득세 15.4% (일반과세) · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.nts.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국세청
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 금융기관의 상품 조건과 차이가 발생할 수 있습니다. 정확한
          금액은 이용하시는 금융기관을 통해 확인해 주세요.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
