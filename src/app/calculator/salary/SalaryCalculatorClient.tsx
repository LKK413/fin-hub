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

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              세전 연봉과 세후 연봉은 무엇이 다른가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              세전 연봉은 4대보험료와 세금을 공제하기 전 회사와 계약한
              금액이고, 세후 연봉(실수령액)은 여기서 국민연금·건강보험·
              고용보험·소득세 등을 뺀 뒤 실제로 통장에 들어오는 금액입니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              식대는 비과세인가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              회사가 별도 식사를 제공하지 않는 경우, 월 20만원 이하의 식대는
              비과세로 처리되어 소득세·4대보험 산정에서 제외될 수 있습니다.
              이 계산기는 입력한 연봉 전체를 과세 대상으로 계산하므로, 비과세
              항목이 있다면 실제 실수령액은 계산 결과보다 조금 더 많을 수
              있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              상여금도 연봉에 포함되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              일반적으로 회사가 안내하는 연봉에는 상여금이 포함되어 있는
              경우가 많습니다. 다만 상여금 지급 시기에 따라 월별 실수령액이
              달라질 수 있어, 상여금이 지급되는 달은 다른 달보다 실수령액이
              많아 보일 수 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              월 실수령액이 매달 달라질 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 국민연금 기준소득월액 조정 시기, 상여금·성과급 지급 여부,
              연말정산에 따른 환급·추가납부 등으로 인해 매달 실수령액이
              조금씩 달라질 수 있습니다. 이 계산기는 연봉을 12개월로 균등
              배분했을 때의 평균적인 월 실수령액을 보여줍니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              퇴직금은 연봉에 포함되나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              아니요. 퇴직금은 재직 중 급여와 별도로, 퇴직 시점에 근속기간과
              평균임금을 기준으로 계산해 지급됩니다. 예상 퇴직금이 궁금하다면{" "}
              <a
                href="/calculator/severance"
                className="text-amber-600 underline hover:text-amber-700"
              >
                퇴직금 계산기
              </a>
              를 이용해보세요.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 2025년 4대보험 요율 · 최종 업데이트: 2026년 8월 27일</p>
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
          ,{" "}
          <a
            href="https://www.nps.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국민연금공단
          </a>
          ,{" "}
          <a
            href="https://www.nhis.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국민건강보험공단
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 급여·세금·보험료와 차이가 발생할 수 있습니다. 정확한 금액은
          관련 기관 또는 전문가를 통해 확인해 주세요.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href="/articles/salary-net-pay-table-2026"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            2026년 연봉 실수령액표
          </a>
          <a
            href="/articles/salary-deductions-guide"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            연봉 공제 항목 총정리
          </a>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
