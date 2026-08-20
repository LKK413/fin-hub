"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { calculateSalary, type SalaryResult } from "@/lib/calculators/salary";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface SalaryInputs {
  annualSalary: string;
  dependents: string;
  childrenUnder20: string;
}

export default function SalaryCalculatorClient() {
  const [annualSalary, setAnnualSalary] = useState("50000000");
  const [dependents, setDependents] = useState("1");
  const [childrenUnder20, setChildrenUnder20] = useState("0");
  const [result, setResult] = useState<SalaryResult | null>(null);
  const { history, addEntry } = useCalculationHistory<SalaryInputs>("salary");

  function runCalculation(inputs: SalaryInputs) {
    const gross = Number(inputs.annualSalary.replace(/[^0-9]/g, ""));
    if (!gross || gross <= 0) return;

    const calcResult = calculateSalary({
      annualGrossSalary: gross,
      dependents: Math.max(1, Number(inputs.dependents) || 1),
      childrenUnder20: Number(inputs.childrenUnder20) || 0,
    });
    setResult(calcResult);
    addEntry(
      `연봉 ${formatWon(gross)} → 월 ${formatWon(calcResult.monthlyNetSalary)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({ annualSalary, dependents, childrenUnder20 });
  }

  function handleSelectHistory(inputs: SalaryInputs) {
    setAnnualSalary(inputs.annualSalary);
    setDependents(inputs.dependents);
    setChildrenUnder20(inputs.childrenUnder20);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Banknote className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">연봉 실수령액 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        국민연금·건강보험·고용보험·소득세를 반영한 월 실수령액을 계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            연봉 (세전, 원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={annualSalary}
            onChange={(e) => setAnnualSalary(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 50000000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              부양가족 수 (본인 포함)
            </label>
            <input
              type="number"
              min={1}
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              8~20세 자녀 수
            </label>
            <input
              type="number"
              min={0}
              value={childrenUnder20}
              onChange={(e) => setChildrenUnder20(e.target.value)}
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
          <div className="bg-zinc-950 px-6 py-6 text-center">
            <p className="text-sm text-amber-400">월 예상 실수령액</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.monthlyNetSalary} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              연 실수령액 약 {formatWon(result.annualNetSalary)}
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">월 세전 급여</td>
                  <td className="py-2 text-right">
                    {formatWon(result.monthlyGrossSalary)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">국민연금</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.nationalPension)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">건강보험</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.healthInsurance)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">장기요양보험</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.longTermCare)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">고용보험</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.employmentInsurance)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">소득세</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.incomeTax)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">지방소득세</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.localIncomeTax)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-200 font-medium">
                  <td className="py-2">공제액 합계</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.totalDeduction)}
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
          연봉 실수령액은 어떻게 계산되나요?
        </h2>
        <p>
          세전 연봉에서 국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험료의
          12.95%), 고용보험(0.9%)을 공제합니다. 소득세는 근로소득공제·인적공제·
          4대보험료 소득공제를 모두 반영한 과세표준에 기본세율을 적용한 뒤,
          근로소득세액공제와 자녀세액공제(8세 이상 자녀)를 차감해 계산합니다.
          지방소득세는 소득세의 10%입니다.
        </p>
        <p>
          4대보험 요율과 소득세 구간은 매년 개정될 수 있으며, 실제 원천징수액은
          회사의 급여 규정이나 국세청 간이세액표에 따라 다소 차이가 날 수
          있습니다. 이 계산기는 참고용 추정치를 제공합니다.
        </p>
      </section>

      <AdUnit slot="8944805429" />
    </div>
  );
}
