"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import {
  calculateSeveranceTax,
  type SeveranceTaxResult,
} from "@/lib/calculators/severanceTax";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface SeveranceTaxInputs {
  joinDate: string;
  resignDate: string;
  severancePay: string;
}

export default function SeveranceTaxCalculatorClient() {
  const [joinDate, setJoinDate] = useState("2016-01-01");
  const [resignDate, setResignDate] = useState("2026-07-30");
  const [severancePay, setSeverancePay] = useState("50,000,000");
  const [result, setResult] = useState<SeveranceTaxResult | null>(null);
  const { history, addEntry } =
    useCalculationHistory<SeveranceTaxInputs>("severance-tax");

  function runCalculation(inputs: SeveranceTaxInputs) {
    if (!inputs.joinDate || !inputs.resignDate) return;
    if (new Date(inputs.resignDate) <= new Date(inputs.joinDate)) return;
    const pay = Number(inputs.severancePay.replace(/[^0-9]/g, ""));
    if (!pay || pay <= 0) return;

    const calcResult = calculateSeveranceTax({
      joinDate: inputs.joinDate,
      resignDate: inputs.resignDate,
      severancePay: pay,
    });
    setResult(calcResult);
    addEntry(
      `퇴직금 ${formatWon(pay)} → 세후 ${formatWon(calcResult.netSeverancePay)}`,
      inputs
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation({ joinDate, resignDate, severancePay });
  }

  function handleSelectHistory(inputs: SeveranceTaxInputs) {
    setJoinDate(inputs.joinDate);
    setResignDate(inputs.resignDate);
    setSeverancePay(inputs.severancePay);
    runCalculation(inputs);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Receipt className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">퇴직소득세 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        근속연수공제와 환산급여공제를 반영해 퇴직소득세와 세후 실수령액을
        계산합니다.
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
            세전 퇴직금 총액 (원)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={severancePay}
            onChange={(e) => setSeverancePay(formatNumberInput(e.target.value))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 50,000,000"
          />
          <p className="mt-1 text-xs text-zinc-400">
            정확한 금액을 모른다면{" "}
            <a href="/calculator/severance" className="underline hover:text-amber-600">
              퇴직금 계산기
            </a>
            로 먼저 예상 퇴직금을 확인해보세요.
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
            <p className="text-sm text-amber-400">세후 실수령 퇴직금</p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber value={result.netSeverancePay} formatter={formatWon} />
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              실효세율 약 {result.effectiveTaxRate.toFixed(2)}%
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">세법상 근속연수</td>
                  <td className="py-2 text-right">{result.workedYears}년</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">근속연수공제</td>
                  <td className="py-2 text-right">
                    {formatWon(result.serviceYearDeduction)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">환산급여</td>
                  <td className="py-2 text-right">
                    {formatWon(result.convertedSalary)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">환산급여공제</td>
                  <td className="py-2 text-right">
                    {formatWon(result.convertedSalaryDeduction)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">과세표준</td>
                  <td className="py-2 text-right">
                    {formatWon(result.taxBase)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">퇴직소득세</td>
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
                  <td className="py-2">세금 합계</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.totalTax)}
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
          퇴직소득세는 어떻게 계산되나요?
        </h2>
        <p>
          퇴직소득은 근로소득과 합산하지 않고{" "}
          <strong>퇴직소득세</strong>라는 별도 세목으로 분류과세됩니다. 근속연수가
          길수록 세금 부담을 낮춰주는 구조라, 실제 실효세율은 일반적으로
          체감보다 훨씬 낮습니다. 자세한 계산 과정은{" "}
          <a
            href="/articles/severance-tax-explained"
            className="text-amber-600 underline hover:text-amber-700"
          >
            퇴직소득세 완전정리
          </a>
          글에서 예시와 함께 확인할 수 있습니다.
        </p>
        <p>
          세법상 근속연수는 실제 재직일수와 별개로{" "}
          <strong>1년 미만 기간은 1년으로 올림</strong> 처리합니다. 예를 들어
          9년 3개월을 근무했다면 세법상 근속연수는 10년으로 계산됩니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              근속연수가 길면 세금이 정말 줄어드나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 근속연수공제와 환산급여 계산 과정에서 근속연수가 길수록
              과세표준이 낮아지도록 설계되어 있어, 오래 근무할수록 실효세율이
              낮아지는 경향이 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              퇴직연금(IRP)으로 받으면 세금이 달라지나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              퇴직금을 IRP 계좌로 이체해 연금 형태로 나눠 받으면, 일시금으로
              받을 때보다 세금을 30~40% 감면받을 수 있습니다. 이 계산기는
              일시금으로 수령하는 경우를 기준으로 합니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              퇴직소득세는 누가 계산해서 떼나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              퇴직금을 지급하는 회사(원천징수의무자)가 계산해 원천징수한 뒤
              나머지 금액을 지급합니다. 이 계산기는 예상 세액을 미리 가늠해볼
              수 있는 참고용 도구입니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              계산 결과와 실제 원천징수 금액이 다를 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 중간정산 이력, 이전 근무지 퇴직소득 합산 여부 등에 따라
              실제 세액은 달라질 수 있습니다. 정확한 금액은 국세청 홈택스나
              회사 인사팀을 통해 확인하시기 바랍니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 소득세법 시행령 제42조의2 (2023.1.1. 개정) · 최종 업데이트: 2026년 8월 27일</p>
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
          실제 원천징수 세액과 차이가 발생할 수 있습니다. 정확한 금액은
          관련 기관 또는 전문가를 통해 확인해 주세요.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href="/articles/severance-tax-explained"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직소득세 완전정리
          </a>
          <a
            href="/calculator/severance"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직금 계산기 바로가기
          </a>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
