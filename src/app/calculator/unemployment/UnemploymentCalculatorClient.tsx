"use client";

import { useState } from "react";
import { LifeBuoy } from "lucide-react";
import {
  calculateUnemploymentBenefit,
  DAILY_BENEFIT_UPPER_LIMIT,
  DAILY_BENEFIT_LOWER_LIMIT,
  type UnemploymentResult,
} from "@/lib/calculators/unemployment";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface UnemploymentInputs {
  averageMonthlyWage: string;
  contributionYears: string;
  contributionMonthsExtra: string;
  isOver50OrDisabled: boolean;
}

export default function UnemploymentCalculatorClient() {
  const [averageMonthlyWage, setAverageMonthlyWage] = useState("3,000,000");
  const [contributionYears, setContributionYears] = useState("3");
  const [contributionMonthsExtra, setContributionMonthsExtra] = useState("0");
  const [isOver50OrDisabled, setIsOver50OrDisabled] = useState(false);
  const [result, setResult] = useState<UnemploymentResult | null>(null);
  const { history, addEntry } = useCalculationHistory<UnemploymentInputs>("unemployment");

  function runCalculation(inputs: UnemploymentInputs) {
    const wage = Number(inputs.averageMonthlyWage.replace(/[^0-9]/g, ""));
    const years = Number(inputs.contributionYears) || 0;
    const extraMonths = Number(inputs.contributionMonthsExtra) || 0;
    const months = years * 12 + extraMonths;
    if (!wage || wage <= 0) return;

    const calcResult = calculateUnemploymentBenefit({
      averageMonthlyWage: wage,
      contributionMonths: months,
      isOver50OrDisabled: inputs.isOver50OrDisabled,
    });
    setResult(calcResult);
    addEntry(
      `월급 ${formatWon(wage)}, 가입 ${years}년 ${extraMonths}개월 → 총 ${formatWon(calcResult.totalBenefit)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({
      averageMonthlyWage,
      contributionYears,
      contributionMonthsExtra,
      isOver50OrDisabled,
    });
  }

  function handleSelectHistory(inputs: UnemploymentInputs) {
    setAverageMonthlyWage(inputs.averageMonthlyWage);
    setContributionYears(inputs.contributionYears);
    setContributionMonthsExtra(inputs.contributionMonthsExtra);
    setIsOver50OrDisabled(inputs.isOver50OrDisabled);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <LifeBuoy className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">실업급여 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        평균임금과 고용보험 가입기간을 입력하면 예상 구직급여를 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            퇴직 전 평균 월급여 (세전, 원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={averageMonthlyWage}
            onChange={(e) => setAverageMonthlyWage(formatNumberInput(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 3,000,000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              고용보험 가입년수
            </label>
            <input
              type="number"
              min={0}
              value={contributionYears}
              onChange={(e) => setContributionYears(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">추가 개월</label>
            <input
              type="number"
              min={0}
              max={11}
              value={contributionMonthsExtra}
              onChange={(e) => setContributionMonthsExtra(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isOver50OrDisabled}
            onChange={(e) => setIsOver50OrDisabled(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
          />
          만 50세 이상이거나 장애인입니다
        </label>

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
            <p className="text-sm text-amber-400">총 예상 수급액</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.totalBenefit} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              1일 {formatWon(result.dailyBenefit)} × {result.scheduledDays}일
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">기초일액(근사)</td>
                  <td className="py-2 text-right">{formatWon(result.dailyWage)}</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">구직급여일액</td>
                  <td className="py-2 text-right">
                    {formatWon(result.dailyBenefit)}
                    {result.isCapped && " (상한 적용)"}
                    {result.isFloored && " (하한 적용)"}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">소정급여일수</td>
                  <td className="py-2 text-right">{result.scheduledDays}일</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <HistoryList history={history} onSelect={handleSelectHistory} />

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          실업급여는 어떻게 계산되나요?
        </h2>
        <p>
          구직급여일액은 <strong>퇴직 전 평균임금(기초일액)의 60%</strong>로
          계산하되, 1일 상한액 {formatWon(DAILY_BENEFIT_UPPER_LIMIT)}과 하한액{" "}
          {formatWon(DAILY_BENEFIT_LOWER_LIMIT)} 사이로 제한됩니다. 이
          계산기는 기초일액을 &quot;퇴직 전 3개월 평균임금 × 3 ÷ 90&quot;으로
          근사합니다.
        </p>
        <p>
          총 수급액은 구직급여일액에 <strong>소정급여일수</strong>를 곱해
          계산합니다. 소정급여일수는 만 50세 미만/이상 여부와 고용보험
          가입기간에 따라 120일에서 270일까지 차등 적용됩니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              자발적으로 퇴사해도 실업급여를 받을 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              원칙적으로 자발적 퇴사(개인 사정에 의한 퇴직)는 수급 대상이
              아닙니다. 다만 임금 체불, 근로조건 악화, 육아, 질병 등 정당한
              사유가 인정되면 자발적 퇴사도 수급 대상이 될 수 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              실업급여는 언제부터 받을 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              퇴사 후 워크넷 구직 등록과 고용센터 수급자격 인정을 거쳐야
              하며, 이직일 다음 날부터 12개월 안에 소정급여일수만큼 지급받을
              수 있습니다. 신청이 늦어지면 남은 지급일수가 줄어들 수 있어
              가능한 빨리 신청하는 것이 좋습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              실업급여를 받으면서 아르바이트를 해도 되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              수급 기간 중 소득이 발생하는 근로를 하면 반드시 고용센터에
              신고해야 합니다. 신고하지 않고 근로하다 적발되면 부정수급으로
              처리되어 급여 반환은 물론 추가 제재를 받을 수 있습니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 2026년 구직급여 상한·하한액 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.ei.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            고용보험 홈페이지
          </a>
          ,{" "}
          <a
            href="https://www.moel.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            고용노동부
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 수급 자격과 금액은 고용센터 심사를 통해 결정됩니다.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
