// 국민연금 예상 수령액 — 간이 비례식 기준
// 정확한 계산은 국민연금공단이 매년 재평가율·A값(전체 가입자 평균소득)을
// 반영한 자체 공식을 사용하며, 이 계산기는 그 대신 널리 쓰이는
// "평균소득월액 × 소득대체율 × (가입월수/480개월)" 비례식을 사용한다.
export const FULL_TERM_MONTHS = 480; // 40년
// 2026년 기준, 40년 가입 시 소득대체율
export const DEFAULT_INCOME_REPLACEMENT_RATE_PERCENT = 43;

export interface PensionInput {
  averageMonthlyIncome: number; // 가입 기간 중 평균 기준소득월액
  contributionMonths: number; // 국민연금 가입월수
  incomeReplacementRatePercent: number; // 소득대체율(40년 가입 기준, %)
}

export interface PensionResult {
  contributionYears: number;
  estimatedMonthlyPension: number;
  estimatedAnnualPension: number;
  proratedReplacementRatePercent: number; // 실제 가입기간을 반영한 실질 소득대체율
}

export function calculatePension({
  averageMonthlyIncome,
  contributionMonths,
  incomeReplacementRatePercent,
}: PensionInput): PensionResult {
  const months = Math.max(0, Math.min(contributionMonths, FULL_TERM_MONTHS));
  const proratedRate = (incomeReplacementRatePercent * months) / FULL_TERM_MONTHS;
  const estimatedMonthlyPension = Math.round(
    averageMonthlyIncome * (proratedRate / 100)
  );

  return {
    contributionYears: Math.round((months / 12) * 10) / 10,
    estimatedMonthlyPension,
    estimatedAnnualPension: estimatedMonthlyPension * 12,
    proratedReplacementRatePercent: Math.round(proratedRate * 10) / 10,
  };
}
