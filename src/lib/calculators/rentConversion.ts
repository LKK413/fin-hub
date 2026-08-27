export type ConversionDirection = "jeonseToMonthly" | "monthlyToJeonse";

// 주택임대차보호법 시행령 제9조 — 법정 전환율 상한 가산율(기준금리 + 2%p)
export const LEGAL_RATE_MARGIN_PERCENT = 2;
// 법정 전환율은 위 값과 연 10% 중 낮은 쪽
export const LEGAL_RATE_CEILING_PERCENT = 10;

export function legalConversionRateCap(baseRatePercent: number): number {
  return Math.min(baseRatePercent + LEGAL_RATE_MARGIN_PERCENT, LEGAL_RATE_CEILING_PERCENT);
}

export interface RentConversionInput {
  direction: ConversionDirection;
  // jeonseToMonthly: 전세보증금 / monthlyToJeonse: 월세보증금
  baseDeposit: number;
  // jeonseToMonthly: 전환 후(낮춘) 보증금 / monthlyToJeonse: 사용 안 함
  reducedDeposit: number;
  // monthlyToJeonse에서만 사용
  monthlyRent: number;
  conversionRatePercent: number;
}

export interface RentConversionResult {
  // jeonseToMonthly 결과
  monthlyRent: number;
  // monthlyToJeonse 결과
  convertedJeonseDeposit: number;
}

export function calculateRentConversion({
  direction,
  baseDeposit,
  reducedDeposit,
  monthlyRent,
  conversionRatePercent,
}: RentConversionInput): RentConversionResult {
  const rate = conversionRatePercent / 100;

  if (direction === "jeonseToMonthly") {
    const depositDecrease = Math.max(0, baseDeposit - reducedDeposit);
    const computedMonthlyRent = Math.round((depositDecrease * rate) / 12);
    return { monthlyRent: computedMonthlyRent, convertedJeonseDeposit: 0 };
  }

  // monthlyToJeonse: 월세보증금 + (월세×12 ÷ 전환율)
  const convertedJeonseDeposit =
    rate > 0 ? Math.round(baseDeposit + (monthlyRent * 12) / rate) : baseDeposit;
  return { monthlyRent: 0, convertedJeonseDeposit };
}
