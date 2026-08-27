"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import {
  calculateYearEndTax,
  type YearEndTaxResult,
} from "@/lib/calculators/yearEndTax";
import { formatNumberInput } from "@/lib/formatNumberInput";
import { useCalculationHistory } from "@/lib/useCalculationHistory";
import { HistoryList } from "@/components/HistoryList";
import { CountUpNumber } from "@/components/CountUpNumber";
import { AdUnit } from "@/components/AdUnit";

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

interface YearEndTaxInputs {
  annualSalary: string;
  dependents: string;
  childrenUnder20: string;
  creditCardSpending: string;
  debitCashReceiptSpending: string;
  pensionSavingContribution: string;
  insurancePremium: string;
  medicalExpense: string;
  educationExpense: string;
  donationAmount: string;
  alreadyWithheldTax: string;
}

const emptyInputs: YearEndTaxInputs = {
  annualSalary: "50,000,000",
  dependents: "1",
  childrenUnder20: "0",
  creditCardSpending: "12,000,000",
  debitCashReceiptSpending: "6,000,000",
  pensionSavingContribution: "0",
  insurancePremium: "1,000,000",
  medicalExpense: "0",
  educationExpense: "0",
  donationAmount: "0",
  alreadyWithheldTax: "2,500,000",
};

function moneyField(
  label: string,
  value: string,
  onChange: (v: string) => void,
  placeholder?: string
) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(formatNumberInput(e.target.value))}
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function YearEndTaxCalculatorClient() {
  const [inputs, setInputs] = useState<YearEndTaxInputs>(emptyInputs);
  const [result, setResult] = useState<YearEndTaxResult | null>(null);
  const { history, addEntry } = useCalculationHistory<YearEndTaxInputs>("year-end-tax");

  function set<K extends keyof YearEndTaxInputs>(key: K, value: string) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function num(value: string) {
    return Number(value.replace(/[^0-9]/g, "")) || 0;
  }

  function runCalculation(data: YearEndTaxInputs) {
    const annualGrossSalary = num(data.annualSalary);
    if (!annualGrossSalary) return;

    const calcResult = calculateYearEndTax({
      annualGrossSalary,
      dependents: Math.max(1, Number(data.dependents) || 1),
      childrenUnder20: Number(data.childrenUnder20) || 0,
      creditCardSpending: num(data.creditCardSpending),
      debitCashReceiptSpending: num(data.debitCashReceiptSpending),
      pensionSavingContribution: num(data.pensionSavingContribution),
      insurancePremium: num(data.insurancePremium),
      medicalExpense: num(data.medicalExpense),
      educationExpense: num(data.educationExpense),
      donationAmount: num(data.donationAmount),
      alreadyWithheldTax: num(data.alreadyWithheldTax),
    });
    setResult(calcResult);
    addEntry(
      `연봉 ${formatWon(annualGrossSalary)} → ${
        calcResult.refundOrDue >= 0 ? "환급" : "추가납부"
      } ${formatWon(Math.abs(calcResult.refundOrDue))}`,
      data
    );
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    runCalculation(inputs);
  }

  function handleSelectHistory(data: YearEndTaxInputs) {
    setInputs(data);
    runCalculation(data);
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Wallet className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">연말정산 환급액 계산기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        주요 소득·세액공제 항목을 반영해 예상 환급액(또는 추가 납부액)을
        계산합니다.
      </p>

      <form
        onSubmit={handleCalculate}
        className="mt-8 space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-800">기본 정보</h2>
          {moneyField("총급여 (연봉, 세전, 원)", inputs.annualSalary, (v) =>
            set("annualSalary", v)
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                부양가족 수 (본인 포함)
              </label>
              <input
                type="number"
                min={1}
                value={inputs.dependents}
                onChange={(e) => set("dependents", e.target.value)}
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
                value={inputs.childrenUnder20}
                onChange={(e) => set("childrenUnder20", e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-right outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>
          {moneyField(
            "이미 원천징수로 낸 세금 총액 (원)",
            inputs.alreadyWithheldTax,
            (v) => set("alreadyWithheldTax", v),
            "예: 2,500,000"
          )}
          <p className="-mt-2 text-xs text-zinc-400">
            매월 급여명세서의 소득세·지방소득세를 1년치 합산한 금액이에요.
            정확한 금액은 원천징수영수증에서 확인할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4 border-t border-zinc-100 pt-4">
          <h2 className="text-sm font-semibold text-zinc-800">신용카드 등 사용액</h2>
          {moneyField(
            "신용카드 사용액 (원)",
            inputs.creditCardSpending,
            (v) => set("creditCardSpending", v)
          )}
          {moneyField(
            "체크카드·현금영수증 사용액 (원)",
            inputs.debitCashReceiptSpending,
            (v) => set("debitCashReceiptSpending", v)
          )}
        </div>

        <div className="space-y-4 border-t border-zinc-100 pt-4">
          <h2 className="text-sm font-semibold text-zinc-800">세액공제 항목</h2>
          {moneyField(
            "연금저축·IRP 납입액 (원)",
            inputs.pensionSavingContribution,
            (v) => set("pensionSavingContribution", v)
          )}
          {moneyField("보장성보험료 (원)", inputs.insurancePremium, (v) =>
            set("insurancePremium", v)
          )}
          {moneyField("의료비 지출액 (원)", inputs.medicalExpense, (v) =>
            set("medicalExpense", v)
          )}
          {moneyField("교육비 지출액 (원)", inputs.educationExpense, (v) =>
            set("educationExpense", v)
          )}
          {moneyField("기부금액 (원)", inputs.donationAmount, (v) =>
            set("donationAmount", v)
          )}
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
              {result.refundOrDue >= 0 ? "예상 환급액" : "예상 추가 납부액"}
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-white">
              <CountUpNumber
                value={Math.abs(result.refundOrDue)}
                formatter={formatWon}
              />
            </p>
          </div>

          <div className="px-6 pb-6 pt-2">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">과세표준</td>
                  <td className="py-2 text-right">{formatWon(result.taxBase)}</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">산출세액</td>
                  <td className="py-2 text-right">{formatWon(result.calculatedTax)}</td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">신용카드 등 소득공제</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.creditCardDeduction)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-100">
                  <td className="py-2 text-zinc-500">세액공제 합계</td>
                  <td className="py-2 text-right">
                    -{formatWon(result.totalTaxCredit)}
                  </td>
                </tr>
                <tr className="border-t border-zinc-200 font-medium">
                  <td className="py-2">결정세액(소득세+지방세)</td>
                  <td className="py-2 text-right">
                    {formatWon(result.totalFinalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
            <details className="mt-4 text-xs text-zinc-500">
              <summary className="cursor-pointer">세액공제 상세 내역 보기</summary>
              <table className="mt-2 w-full">
                <tbody>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">근로소득세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.earnedIncomeTaxCreditAmount)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">자녀세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.childTaxCreditAmount)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">연금저축·IRP 세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.pensionSavingCredit)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">보험료 세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.insurancePremiumCredit)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">의료비 세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.medicalExpenseCredit)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">교육비 세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.educationExpenseCredit)}
                    </td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="py-1.5">기부금 세액공제</td>
                    <td className="py-1.5 text-right">
                      {formatWon(result.donationCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </details>
          </div>
        </div>
      )}

      <HistoryList history={history} onSelect={handleSelectHistory} />

      <section className="mt-10 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          환급액은 어떻게 계산되나요?
        </h2>
        <p>
          연말정산은 1년간 실제로 냈어야 할 세금(결정세액)과, 매달 월급에서
          미리 떼인 세금(기납부세액)을 비교해 차액을 돌려주거나 더 걷는
          절차입니다. 소득·세액공제를 많이 받을수록 결정세액이 줄어들어
          환급액이 늘어납니다.
        </p>
        <p>
          이 계산기는 근로소득공제·인적공제·4대보험료공제·신용카드 등
          소득공제로 과세표준을 구하고, 여기에 기본세율을 적용한 뒤
          근로소득세액공제·자녀세액공제·연금저축·보험료·의료비·교육비·기부금
          세액공제를 차감하는 방식으로 계산합니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              기납부세액은 어디서 확인하나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              회사에서 발급하는 근로소득 원천징수영수증의 &quot;결정세액&quot;
              항목이나, 매월 급여명세서의 소득세·지방소득세를 1년치 더한
              금액으로 확인할 수 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              신용카드와 체크카드 중 뭘 더 많이 써야 유리한가요?
            </summary>
            <p className="mt-2 text-zinc-500">
              공제율은 체크카드·현금영수증(30%)이 신용카드(15%)보다 높습니다.
              다만 총급여의 25%까지는 어느 쪽을 써도 공제 대상이 아니므로,
              25% 구간까지는 혜택이 좋은 신용카드를 쓰고 그 이후부터
              체크카드·현금영수증을 쓰는 것이 유리하다고 알려져 있습니다.
            </p>
          </details>
          <details className="group rounded-lg border border-zinc-200 bg-white p-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-800">
              계산 결과와 실제 연말정산 결과가 다를 수 있나요?
            </summary>
            <p className="mt-2 text-zinc-500">
              네. 이 계산기는 자주 쓰이는 주요 항목만 반영한 간이 계산기라,
              월세액공제·주택자금공제·중소기업취업자감면 등 반영하지 못한
              항목이 있으면 실제 결과와 차이가 날 수 있습니다. 정확한 금액은
              국세청 홈택스의 연말정산 미리보기 서비스를 이용해 보세요.
            </p>
          </details>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 2025년 귀속 연말정산 주요 공제 항목 · 최종 업데이트: 2026년 8월 27일</p>
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
            href="https://www.hometax.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            홈택스
          </a>
        </p>
        <p className="mt-2">
          Reko에서 제공하는 계산 결과는 이해를 돕기 위한 참고용 정보이며,
          월세액공제 등 일부 항목은 반영되지 않았습니다. 정확한 금액은
          홈택스 연말정산 미리보기 또는 세무 전문가를 통해 확인해 주세요.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </div>
  );
}
