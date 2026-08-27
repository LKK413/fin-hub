"use client";

import { useState } from "react";
import { Landmark } from "lucide-react";
import {
  calculatePension,
  DEFAULT_INCOME_REPLACEMENT_RATE_PERCENT,
  type PensionResult,
} from "@/lib/calculators/pension";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface PensionInputs {
  averageMonthlyIncome: string;
  contributionYears: string;
  contributionMonthsExtra: string;
  incomeReplacementRate: string;
}

export default function PensionCalculatorClient() {
  const [averageMonthlyIncome, setAverageMonthlyIncome] = useState("3,500,000");
  const [contributionYears, setContributionYears] = useState("25");
  const [contributionMonthsExtra, setContributionMonthsExtra] = useState("0");
  const [incomeReplacementRate, setIncomeReplacementRate] = useState(
    String(DEFAULT_INCOME_REPLACEMENT_RATE_PERCENT)
  );
  const [result, setResult] = useState<PensionResult | null>(null);
  const { history, addEntry } = useCalculationHistory<PensionInputs>("pension");

  function runCalculation(inputs: PensionInputs) {
    const income = Number(inputs.averageMonthlyIncome.replace(/[^0-9]/g, ""));
    const years = Number(inputs.contributionYears) || 0;
    const extraMonths = Number(inputs.contributionMonthsExtra) || 0;
    const rate = Number(inputs.incomeReplacementRate);
    const months = years * 12 + extraMonths;
    if (!income || income <= 0 || months <= 0 || rate <= 0) return;

    const calcResult = calculatePension({
      averageMonthlyIncome: income,
      contributionMonths: months,
      incomeReplacementRatePercent: rate,
    });
    setResult(calcResult);
    addEntry(
      `평균소득 ${formatWon(income)}, 가입 ${years}년 ${extraMonths}개월 → 월 ${formatWon(calcResult.estimatedMonthlyPension)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({
      averageMonthlyIncome,
      contributionYears,
      contributionMonthsExtra,
      incomeReplacementRate,
    });
  }

  function handleSelectHistory(inputs: PensionInputs) {
    setAverageMonthlyIncome(inputs.averageMonthlyIncome);
    setContributionYears(inputs.contributionYears);
    setContributionMonthsExtra(inputs.contributionMonthsExtra);
    setIncomeReplacementRate(inputs.incomeReplacementRate);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Landmark className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">국민연금 예상 수령액 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        평균소득과 가입기간을 입력하면 예상 노령연금 월액을 간이 추정합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            가입기간 중 평균 월소득 (원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={averageMonthlyIncome}
            onChange={(e) =>
              setAverageMonthlyIncome(formatNumberInput(e.target.value))
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 3,500,000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              국민연금 가입년수
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={contributionYears}
              onChange={(e) => setContributionYears(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              추가 개월
            </label>
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

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            소득대체율 (40년 가입 기준, %)
          </label>
          <input
            type="number"
            step="0.1"
            min={0}
            value={incomeReplacementRate}
            onChange={(e) => setIncomeReplacementRate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
          />
          <p className="mt-1 text-xs text-zinc-400">
            2026년 기준 40년 가입 시 소득대체율은 약 43%입니다. 매년 조금씩
            바뀌므로 최신 값으로 수정해서 계산해보세요.
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
            <p className="text-sm text-amber-400">예상 연금 월액</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.estimatedMonthlyPension} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              연 예상 수령액 약 {formatWon(result.estimatedAnnualPension)}
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">가입기간</td>
                  <td className="py-2 text-right">{result.contributionYears}년</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">가입기간 반영 실질 대체율</td>
                  <td className="py-2 text-right">
                    {result.proratedReplacementRatePercent}%
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
          이 계산기는 어떤 방식으로 계산하나요?
        </h2>
        <p>
          국민연금공단은 매년 전체 가입자 평균소득(A값)과 재평가율을 반영한
          정밀한 자체 공식으로 연금액을 산정합니다. 이 계산기는 그 대신 널리
          쓰이는 단순 비례식,{" "}
          <strong>
            예상 연금월액 = 평균 월소득 × 소득대체율 × (가입월수 ÷
            480개월)
          </strong>
          을 사용한 참고용 추정치입니다.
        </p>
        <p>
          소득대체율은 &quot;40년을 꽉 채워 가입했을 때&quot; 기준 비율이라,
          가입기간이 40년보다 짧으면 그 비율만큼 실질 대체율도 함께
          낮아집니다.
        </p>
        <p>
          정확한 예상 수령액은{" "}
          <a
            href="https://www.nps.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 underline hover:text-amber-700"
          >
            국민연금공단 홈페이지
          </a>
          의 &quot;내 연금 알아보기&quot;에서 실제 가입 이력을 기준으로
          확인할 수 있습니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              국민연금은 몇 세부터 받을 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              출생연도에 따라 수급 개시 연령이 다르며, 1969년 이후 출생자는
              만 65세부터 받습니다. 가입기간이 10년(120개월) 이상이어야
              노령연금 수급 자격이 생깁니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              가입기간이 10년이 안 되면 어떻게 되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              10년 미만이면 매달 받는 노령연금 대신, 그동안 낸 보험료에
              이자를 더한 반환일시금을 한 번에 받게 됩니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              소득대체율은 왜 계속 낮아지나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              국민연금 재정 안정을 위해 법 개정으로 소득대체율이 단계적으로
              조정되어 왔습니다. 매년 값이 달라질 수 있어 이 계산기에서도
              직접 수정할 수 있게 해두었습니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 2026년 소득대체율(40년 가입 기준) 약 43% · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.nps.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국민연금공단
          </a>
        </p>
        <p className="mt-2">
          이 계산기는 정밀 계산식이 아닌 단순 비례식을 사용한 참고용
          추정치이며, 실제 수령액과 차이가 클 수 있습니다. 정확한 금액은
          국민연금공단을 통해 확인해 주세요.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
