"use client";

import { useState } from "react";
import { HandCoins } from "lucide-react";
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
          <HandCoins className="h-5 w-5" strokeWidth={1.75} />
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
          이 밖에 <strong>만기일시상환</strong> 방식도 있습니다. 대출 기간
          동안 이자만 납부하다가 만기에 원금을 한 번에 갚는 방식으로, 이
          계산기에서는 지원하지 않지만 신용대출 일부나 담보대출에서 종종
          쓰입니다. 매월 상환 부담은 가장 적은 대신, 만기 시 목돈을 마련해야
          하고 총이자 부담은 가장 큽니다.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          대출 계산 시 주의할 점
        </h2>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>이 계산기는 고정금리를 가정하며, 실제 금융기관 금리와 차이가 있을 수 있습니다.</li>
          <li>변동금리 대출은 금리 변동 주기마다 상환액이 달라질 수 있습니다.</li>
          <li>중도상환수수료가 있는 경우 조기 상환 시 추가 비용이 발생할 수 있습니다.</li>
          <li>인지세, 근저당 설정비 등 대출 실행 시 발생하는 기타 비용은 반영되지 않았습니다.</li>
          <li>실제 적용 금리는 개인 신용점수와 소득, 금융기관의 우대금리 조건에 따라 달라집니다.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              원금균등과 원리금균등 중 어느 방식이 유리한가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              총이자만 놓고 보면 원금균등상환이 더 적습니다. 다만 초반 상환
              부담이 크기 때문에, 매월 일정한 금액을 내며 자금 계획을 세우고
              싶다면 원리금균등상환이 더 맞을 수 있습니다. 본인의 현금흐름에
              맞는 방식을 선택하는 것이 중요합니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              금리가 1% 오르면 얼마나 차이가 나나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              대출금액과 기간에 따라 다르지만, 금액이 크고 기간이 길수록
              차이가 커집니다. 실제 숫자로 비교한 예시는{" "}
              <a
                href="/articles/loan-rate-impact"
                className="text-amber-600 underline hover:text-amber-700"
              >
                대출 금리 1%p 차이 비교 글
              </a>
              에서 확인할 수 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              중도상환하면 이자를 줄일 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네, 원금을 미리 갚으면 그만큼 남은 원금에 대한 이자가 줄어들어
              총이자를 절감할 수 있습니다. 다만 대출 상품에 따라
              중도상환수수료가 부과될 수 있어, 수수료와 절감되는 이자를 함께
              비교해보는 것이 좋습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              대출 계산 결과와 은행 결과가 다른 이유는 무엇인가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              이 계산기는 고정금리·단리 기준의 표준 계산식을 사용합니다.
              실제 은행 상환 스케줄은 이자 계산 기준일, 중도상환, 수수료,
              변동금리 반영 시점 등에 따라 이 계산기와 다소 차이가 날 수
              있습니다.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 고정금리 단리 계산 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          참고 자료:{" "}
          <a
            href="https://www.fss.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            금융감독원
          </a>
          ,{" "}
          <a
            href="https://www.fsc.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            금융위원회
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며
          실제 금융기관의 대출 조건과 차이가 발생할 수 있습니다. 정확한
          조건은 이용하시는 금융기관을 통해 확인해 주세요.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href="/articles/loan-repayment-comparison"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            원리금균등 vs 원금균등 비교
          </a>
          <a
            href="/articles/loan-rate-impact"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            금리 1%p 차이, 이자는 얼마나?
          </a>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
