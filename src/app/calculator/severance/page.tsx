"use client";

import { useState } from "react";
import { Briefcase } from "lucide-react";
import {
  calculateSeverance,
  type SeveranceResult,
} from "@/lib/calculators/severance";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

export default function SeveranceCalculatorPage() {
  const [joinDate, setJoinDate] = useState("2023-01-01");
  const [resignDate, setResignDate] = useState("2026-07-30");
  const [threeMonthWageTotal, setThreeMonthWageTotal] = useState("12000000");
  const [annualBonusTotal, setAnnualBonusTotal] = useState("0");
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState("0");
  const [result, setResult] = useState<SeveranceResult | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    if (!joinDate || !resignDate) return;
    if (new Date(resignDate) <= new Date(joinDate)) return;

    setResult(
      calculateSeverance({
        joinDate,
        resignDate,
        threeMonthWageTotal: Number(threeMonthWageTotal.replace(/[^0-9]/g, "")) || 0,
        annualBonusTotal: Number(annualBonusTotal.replace(/[^0-9]/g, "")) || 0,
        annualLeaveAllowance: Number(annualLeaveAllowance.replace(/[^0-9]/g, "")) || 0,
      })
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
          <Briefcase className="h-5 w-5" strokeWidth={2} />
        </span>
        <h1 className="text-2xl font-bold">퇴직금 계산기</h1>
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
            onChange={(e) => setThreeMonthWageTotal(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            placeholder="예: 12000000"
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
              onChange={(e) => setAnnualBonusTotal(e.target.value)}
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
              onChange={(e) => setAnnualLeaveAllowance(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-500 py-3 font-medium text-white transition-colors hover:bg-amber-600"
        >
          계산하기
        </button>
      </form>

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
          {!result.eligible && (
            <div className="border-b border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
              근속기간이 1년 미만이라 근로기준법상 퇴직금 지급 대상이
              아닙니다. 참고용으로만 확인해주세요.
            </div>
          )}
          <div className="bg-amber-50 px-6 py-6 text-center">
            <p className="text-sm text-amber-700">예상 퇴직금</p>
            <p className="mt-1 text-3xl font-bold text-amber-900">
              {formatWon(result.severancePay)}
            </p>
            <p className="mt-1 text-sm text-amber-600">
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
      </section>
    </div>
  );
}
