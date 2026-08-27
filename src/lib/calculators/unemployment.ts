// 2026년 기준
export const DAILY_BENEFIT_UPPER_LIMIT = 68_100; // 1일 상한액
export const DAILY_BENEFIT_LOWER_LIMIT = 66_048; // 1일 하한액 (최저임금 10,320원 × 80% × 8시간)
export const BENEFIT_RATE = 0.6; // 평균임금 대비 지급률
const AVERAGE_WAGE_DIVISOR = 90; // 퇴직 전 3개월 근사 일수

interface ScheduledDaysTier {
  minMonths: number;
  under50: number;
  over50OrDisabled: number;
}

// 소정급여일수 — 고용보험법 별표1
const SCHEDULED_DAYS_TIERS: ScheduledDaysTier[] = [
  { minMonths: 0, under50: 120, over50OrDisabled: 120 },
  { minMonths: 12, under50: 150, over50OrDisabled: 180 },
  { minMonths: 36, under50: 180, over50OrDisabled: 210 },
  { minMonths: 60, under50: 210, over50OrDisabled: 240 },
  { minMonths: 120, under50: 240, over50OrDisabled: 270 },
];

function scheduledDays(contributionMonths: number, isOver50OrDisabled: boolean): number {
  let tier = SCHEDULED_DAYS_TIERS[0];
  for (const candidate of SCHEDULED_DAYS_TIERS) {
    if (contributionMonths >= candidate.minMonths) tier = candidate;
  }
  return isOver50OrDisabled ? tier.over50OrDisabled : tier.under50;
}

export interface UnemploymentInput {
  averageMonthlyWage: number; // 퇴직 전 평균 월급여(세전)
  contributionMonths: number; // 고용보험 가입기간(개월)
  isOver50OrDisabled: boolean;
}

export interface UnemploymentResult {
  dailyWage: number; // 기초일액(근사)
  dailyBenefit: number; // 구직급여일액
  scheduledDays: number; // 소정급여일수
  totalBenefit: number; // 총 예상 수급액
  isCapped: boolean;
  isFloored: boolean;
}

export function calculateUnemploymentBenefit({
  averageMonthlyWage,
  contributionMonths,
  isOver50OrDisabled,
}: UnemploymentInput): UnemploymentResult {
  const dailyWage = (averageMonthlyWage * 3) / AVERAGE_WAGE_DIVISOR;
  const rawDailyBenefit = dailyWage * BENEFIT_RATE;
  const dailyBenefit = Math.round(
    Math.min(
      DAILY_BENEFIT_UPPER_LIMIT,
      Math.max(DAILY_BENEFIT_LOWER_LIMIT, rawDailyBenefit)
    )
  );
  const days = scheduledDays(contributionMonths, isOver50OrDisabled);

  return {
    dailyWage: Math.round(dailyWage),
    dailyBenefit,
    scheduledDays: days,
    totalBenefit: dailyBenefit * days,
    isCapped: rawDailyBenefit > DAILY_BENEFIT_UPPER_LIMIT,
    isFloored: rawDailyBenefit < DAILY_BENEFIT_LOWER_LIMIT,
  };
}
