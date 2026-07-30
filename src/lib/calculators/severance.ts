const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function threeMonthsBefore(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 3);
  return d;
}

export interface SeveranceInput {
  joinDate: string; // YYYY-MM-DD
  resignDate: string; // YYYY-MM-DD
  threeMonthWageTotal: number; // 퇴직 전 3개월간 지급된 임금 총액(기본급+제수당)
  annualBonusTotal: number; // 퇴직 전 1년간 지급된 상여금 총액
  annualLeaveAllowance: number; // 퇴직 전전년도 미사용 연차에 대해 지급된 연차수당
}

export interface SeveranceResult {
  workedDays: number;
  workedYears: number;
  threeMonthPeriodDays: number;
  averageDailyWage: number;
  severancePay: number;
  eligible: boolean;
}

export function calculateSeverance({
  joinDate,
  resignDate,
  threeMonthWageTotal,
  annualBonusTotal,
  annualLeaveAllowance,
}: SeveranceInput): SeveranceResult {
  const join = new Date(joinDate);
  const resign = new Date(resignDate);

  const workedDays = daysBetween(join, resign);
  const periodStart = threeMonthsBefore(resign);
  const threeMonthPeriodDays = daysBetween(periodStart, resign);

  const bonusPortion = annualBonusTotal * (3 / 12);
  const leavePortion = annualLeaveAllowance * (3 / 12);

  const averageDailyWage =
    threeMonthPeriodDays > 0
      ? (threeMonthWageTotal + bonusPortion + leavePortion) / threeMonthPeriodDays
      : 0;

  const severancePay = Math.round(averageDailyWage * 30 * (workedDays / 365));

  return {
    workedDays,
    workedYears: Math.floor((workedDays / 365) * 10) / 10,
    threeMonthPeriodDays,
    averageDailyWage: Math.round(averageDailyWage),
    severancePay: Math.max(0, severancePay),
    eligible: workedDays >= 365,
  };
}
