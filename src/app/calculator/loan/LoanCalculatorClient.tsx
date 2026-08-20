"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import {
  calculateLoan,
  type LoanResult,
  type RepaymentType,
} from "@/lib/calculators/loan";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface LoanInputs {
  principal: string;
  annualRate: string;
  years: string;
  repaymentType: RepaymentType;
}

export default function LoanCalculatorClient() {
  const [principal, setPrincipal] = useState("100000000");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [years, setYears] = useState("30");
  const [repaymentType, setRepaymentType] =
    useState<RepaymentType>("equalInstallment");
  const [result, setResult] = useState<LoanResult | null>(null);
  const { history, addEntry } = useCalculationHistory<LoanInputs>("loan");

  function runCalculation(inputs: LoanInputs) {
    const p = Number(inputs.principal.replace(/[^0-9]/g, ""));
    const rate = Number(inputs.annualRate);
    const months = Math.round(Number(inputs.years) * 12);
    if (!p || p <= 0 || months <= 0 || rate < 0) return;

    const calcResult = calculateLoan({
      principal: p,
      annualRatePercent: rate,
      months,
      repaymentType: inputs.repaymentType,
    });
    setResult(calcResult);
    addEntry(
      `${formatWon(p)}, 연 ${inputs.annualRate}%, ${inputs.years}년 → 월 ${formatWon(calcResult.firstMonthPayment)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({ principal, annualRate, years, repaymentType });
  }

  function handleSelectHistory(inputs: LoanInputs) {
    setPrincipal(inputs.principal);
    setAnnualRate(inputs.annualRate);
    setYears(inputs.years);
    setRepaymentType(inputs.repaymentType);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Landmark className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">대출이자 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        원리금균등·원금균등 상환 방식별 월 상환액과 총 이자를 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            대출 원금 (원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 100000000"
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
              대출 기간 (년)
            </label>
            <input
              type="number"
              min={1}
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            상환 방식
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRepaymentType("equalInstallment")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                repaymentType === "equalInstallment"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              원리금균등상환
            </button>
            <button
              type="button"
              onClick={() => setRepaymentType("equalPrincipal")}
              className={`rounded-lg border px-3 py-2 text-sm transition-all active:scale-[0.98] ${
                repaymentType === "equalPrincipal"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400"
              }`}
            >
              원금균등상환
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
            <p className="text-sm text-amber-400">
              {repaymentType === "equalInstallment"
                ? "월 상환액 (매월 동일)"
                : "첫 회차 상환액"}
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.firstMonthPayment} formatter={formatWon} />
            </p>
            {repaymentType === "equalPrincipal" && (
              <p className="mt-1 text-sm text-zinc-400">
                마지막 회차 {formatWon(result.lastMonthPayment)}
              </p>
            )}
          </div>

          <div className="px-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">총 상환액</td>
                  <td className="py-2 text-right">
                    {formatWon(result.totalPayment)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">총 이자</td>
                  <td className="py-2 text-right">
                    {formatWon(result.totalInterest)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <details className="px-6 pb-6 pt-4 text-sm">
            <summary className="cursor-pointer text-zinc-500">
              월별 상환 스케줄 보기
            </summary>
            <div className="mt-2 max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white text-zinc-400">
                  <tr>
                    <th className="py-1 text-left font-normal">회차</th>
                    <th className="py-1 text-right font-normal">납입액</th>
                    <th className="py-1 text-right font-normal">원금</th>
                    <th className="py-1 text-right font-normal">이자</th>
                    <th className="py-1 text-right font-normal">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-t border-zinc-100">
                      <td className="py-1">{row.month}</td>
                      <td className="py-1 text-right">
                        {row.payment.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-1 text-right">
                        {row.principalPortion.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-1 text-right">
                        {row.interestPortion.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-1 text-right">
                        {row.remainingBalance.toLocaleString("ko-KR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}

      <HistoryList history={history} onSelect={handleSelectHistory} />

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          원리금균등상환과 원금균등상환의 차이
        </h2>
        <p>
          <strong>원리금균등상환</strong>은 매월 갚는 금액(원금+이자)이 대출
          기간 내내 동일합니다. 초기에는 이자 비중이 크고 원금 비중이 작다가,
          시간이 지날수록 원금 비중이 커집니다. 매월 상환액이 일정해 자금
          계획을 세우기 편합니다.
        </p>
        <p>
          <strong>원금균등상환</strong>은 매월 갚는 원금이 동일하고, 이자는
          남은 원금에 비례해 줄어듭니다. 초반 상환 부담이 크지만 총 이자
          금액은 원리금균등상환보다 적습니다.
        </p>
        <p>
          이 계산기는 고정금리를 가정한 단순 계산이며, 중도상환수수료나
          변동금리, 거치기간 등은 반영하지 않습니다. 실제 상환 스케줄은
          금융기관 대출 약정에 따라 다를 수 있습니다.
        </p>
        <p>
          두 방식의 총이자를 실제 숫자로 비교해보고 싶다면{" "}
          <a
            href="/articles/loan-repayment-comparison"
            className="text-amber-600 underline hover:text-amber-700"
          >
            원리금균등 vs 원금균등 비교 글
          </a>
          도 참고해보세요.
        </p>
      </section>

      <AdUnit slot="8944805429" />
    </div>
  );
}
