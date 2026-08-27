export type SavingsMode = "lumpsum" | "installment";
export type InterestType = "simple" | "compound";

// 이자소득세(14%) + 지방소득세(이자소득세의 10% = 1.4%) = 15.4%
const INTEREST_TAX_RATE = 0.154;

export interface SavingsInput {
  mode: SavingsMode;
  // lumpsum: 예치 원금 / installment: 월 납입액
  amount: number;
  annualRatePercent: number;
  months: number;
  interestType: InterestType;
}

export interface SavingsResult {
  totalDeposit: number; // 원금(예금) 또는 총 납입액(적금)
  grossInterest: number; // 세전 이자
  tax: number; // 이자소득세 + 지방소득세 (15.4%)
  netInterest: number; // 세후 이자
  netTotal: number; // 세후 수령액 (원금/납입액 + 세후 이자)
}

export function calculateSavings({
  mode,
  amount,
  annualRatePercent,
  months,
  interestType,
}: SavingsInput): SavingsResult {
  const annualRate = annualRatePercent / 100;
  const monthlyRate = annualRate / 12;

  let totalDeposit: number;
  let grossInterest: number;

  if (mode === "lumpsum") {
    totalDeposit = amount;
    if (interestType === "simple") {
      grossInterest = amount * annualRate * (months / 12);
    } else {
      grossInterest = amount * (Math.pow(1 + monthlyRate, months) - 1);
    }
  } else {
    totalDeposit = amount * months;
    if (interestType === "simple") {
      // 각 회차 납입금이 만기까지 남은 개월 수만큼 단리 이자를 받는 방식
      grossInterest = amount * monthlyRate * ((months * (months + 1)) / 2);
    } else {
      // 월복리 적립식(연금의 미래가치)
      grossInterest =
        monthlyRate === 0
          ? 0
          : amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) -
            totalDeposit;
    }
  }

  grossInterest = Math.max(0, Math.round(grossInterest));
  const tax = Math.round(grossInterest * INTEREST_TAX_RATE);
  const netInterest = grossInterest - tax;
  const netTotal = totalDeposit + netInterest;

  return { totalDeposit, grossInterest, tax, netInterest, netTotal };
}
