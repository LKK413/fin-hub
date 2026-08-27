"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import {
  calculateSeverance,
  type SeveranceResult,
} from "@/lib/calculators/severance";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface SeveranceInputs {
  joinDate: string;
  resignDate: string;
  threeMonthWageTotal: string;
  annualBonusTotal: string;
  annualLeaveAllowance: string;
}

export default function SeveranceCalculatorClient() {
  const [joinDate, setJoinDate] = useState("2023-01-01");
  const [resignDate, setResignDate] = useState("2026-07-30");
  const [threeMonthWageTotal, setThreeMonthWageTotal] = useState("12,000,000");
  const [annualBonusTotal, setAnnualBonusTotal] = useState("0");
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState("0");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const { history, addEntry } = useCalculationHistory<SeveranceInputs>("severance");

  function runCalculation(inputs: SeveranceInputs) {
    if (!inputs.joinDate || !inputs.resignDate) return;
    if (new Date(inputs.resignDate) <= new Date(inputs.joinDate)) return;

    const calcResult = calculateSeverance({
      joinDate: inputs.joinDate,
      resignDate: inputs.resignDate,
      threeMonthWageTotal:
        Number(inputs.threeMonthWageTotal.replace(/[^0-9]/g, "")) || 0,
      annualBonusTotal:
        Number(inputs.annualBonusTotal.replace(/[^0-9]/g, "")) || 0,
      annualLeaveAllowance:
        Number(inputs.annualLeaveAllowance.replace(/[^0-9]/g, "")) || 0,
    });
    setResult(calcResult);
    addEntry(
      `${inputs.joinDate} ~ ${inputs.resignDate} → ${formatWon(calcResult.severancePay)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({
      joinDate,
      resignDate,
      threeMonthWageTotal,
      annualBonusTotal,
      annualLeaveAllowance,
    });
  }

  function handleSelectHistory(inputs: SeveranceInputs) {
    setJoinDate(inputs.joinDate);
    setResignDate(inputs.resignDate);
    setThreeMonthWageTotal(inputs.threeMonthWageTotal);
    setAnnualBonusTotal(inputs.annualBonusTotal);
    setAnnualLeaveAllowance(inputs.annualLeaveAllowance);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Briefcase className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">퇴직금 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        평균임금을 기준으로 예상 퇴직금을 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              입사일
            </label>
            <input
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              퇴직일
            </label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            퇴직 전 3개월간 받은 임금 총액 (기본급+제수당, 원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={threeMonthWageTotal}
            onChange={(e) => setThreeMonthWageTotal(formatNumberInput(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 12,000,000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              최근 1년 상여금 총액 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={annualBonusTotal}
              onChange={(e) => setAnnualBonusTotal(formatNumberInput(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              연차수당 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={annualLeaveAllowance}
              onChange={(e) => setAnnualLeaveAllowance(formatNumberInput(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
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
          {!result.eligible && (
            <div className="border-b border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              근속기간이 1년 미만이라 근로기준법상 퇴직금 지급 대상이
              아닙니다. 참고용으로만 확인해주세요.
            </div>
          )}
          <div className="bg-zinc-950 px-6 py-6 text-center">
            <p className="text-sm text-amber-400">예상 퇴직금</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.severancePay} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              근속 {result.workedDays.toLocaleString("ko-KR")}일 (약{" "}
              {result.workedYears}년)
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">1일 평균임금</td>
                  <td className="py-2 text-right">
                    {formatWon(result.averageDailyWage)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">평균임금 산정 기간</td>
                  <td className="py-2 text-right">
                    {result.threeMonthPeriodDays}일
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">총 재직일수</td>
                  <td className="py-2 text-right">
                    {result.workedDays.toLocaleString("ko-KR")}일
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
          퇴직금은 어떻게 계산되나요?
        </h2>
        <p>
          근로기준법상 퇴직금은 <strong>1일 평균임금 × 30일 × (재직일수 ÷
          365)</strong>로 계산합니다. 1일 평균임금은 퇴직일 이전 3개월간
          지급된 임금 총액을 그 기간의 총 일수로 나눈 값이며, 상여금과
          연차수당은 연간 지급액의 3/12만큼 반영됩니다.
        </p>
        <p>
          퇴직금은 계속근로기간이 1년 이상이고 4주간 평균하여 1주간의
          소정근로시간이 15시간 이상인 근로자에게 지급됩니다. 이 계산기는
          참고용 추정치이며, 실제 지급액은 회사의 임금 규정이나 통상임금
          비교 등에 따라 달라질 수 있습니다.
        </p>
        <p>
          이 계산기는 세전 퇴직금을 계산합니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              1년 미만 근무하면 퇴직금을 받을 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              아니요. 근로기준법상 퇴직금은 계속근로기간이 1년 이상인
              경우에만 지급 대상이 됩니다. 1년 미만 근무했다면 원칙적으로
              퇴직금이 발생하지 않습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              아르바이트도 퇴직금을 받을 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 고용 형태와 관계없이 계속근로기간 1년 이상, 4주 평균 주
              소정근로시간 15시간 이상이라는 조건을 충족하면 아르바이트나
              단시간 근로자도 퇴직금을 받을 수 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              퇴직금은 언제 지급되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              근로자퇴직급여보장법에 따라 퇴직일로부터 14일 이내에 지급하는
              것이 원칙입니다. 자세한 내용은{" "}
              <a
                href="/articles/severance-payment-timing"
                className="text-amber-600 underline hover:text-amber-700"
              >
                퇴직금 지급 기준과 지급 시기
              </a>
              를 참고해보세요.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              상여금도 평균임금에 포함되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 퇴직 전 1년간 지급된 상여금 총액 중 3/12에 해당하는 금액이
              평균임금 산정에 포함됩니다. 연차수당도 같은 방식으로 일부만
              반영됩니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              퇴직금에도 세금이 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 퇴직금은 일반 근로소득세가 아닌 퇴직소득세로 별도 계산되어
              원천징수됩니다. 위에서 계산한 세전 퇴직금으로{" "}
              <a
                href="/calculator/severance-tax"
                className="text-amber-600 underline hover:text-amber-700"
              >
                퇴직소득세 계산기
              </a>
              에서 세후 실수령액을 바로 확인해보세요.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 근로기준법 평균임금 산정 방식 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.moel.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            고용노동부
          </a>
          ,{" "}
          <a
            href="https://www.comwel.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            근로복지공단
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 퇴직금과 차이가 발생할 수 있습니다. 정확한 금액은 회사의
          임금 규정이나 관련 기관을 통해 확인해 주세요.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href="/calculator/severance-tax"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직소득세 계산기 바로가기
          </a>
          <a
            href="/articles/severance-tax-explained"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직소득세 완전정리
          </a>
          <a
            href="/articles/severance-payment-timing"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직금 지급 기준과 지급 시기
          </a>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
