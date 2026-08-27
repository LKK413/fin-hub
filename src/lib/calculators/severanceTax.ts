import { TAX_BRACKETS } from "./salary";

// 세법상 근속연수: 달력 기준 만 연수를 구하고, 1년 미만의 잔여 기간이
// 하루라도 있으면 1년으로 올림(윤년으로 인해 일수÷365 방식은 오차가 생김)
function workedYearsForTax(join: Date, resign: Date): number {
  let fullYears = resign.getFullYear() - join.getFullYear();
  const anniversary = new Date(join);
  anniversary.setFullYear(join.getFullYear() + fullYears);
  if (anniversary.getTime() > resign.getTime()) {
    fullYears -= 1;
  }
  const flooredAnniversary = new Date(join);
  flooredAnniversary.setFullYear(join.getFullYear() + fullYears);
  const hasRemainder = flooredAnniversary.getTime() < resign.getTime();
  return Math.max(1, hasRemainder ? fullYears + 1 : fullYears);
}

// 근속연수공제 — 소득세법 시행령 제42조의2 (2023.1.1. 개정)
function serviceYearDeduction(workedYears: number): number {
  if (workedYears <= 5) return workedYears * 1_000_000;
  if (workedYears <= 10) return 5_000_000 + (workedYears - 5) * 2_000_000;
  if (workedYears <= 20) return 15_000_000 + (workedYears - 10) * 2_500_000;
  return 40_000_000 + (workedYears - 20) * 3_000_000;
}

// 환산급여공제 — 소득세법 시행령 제42조의2
function convertedSalaryDeduction(convertedSalary: number): number {
  if (convertedSalary <= 8_000_000) return convertedSalary;
  if (convertedSalary <= 70_000_000)
    return 8_000_000 + (convertedSalary - 8_000_000) * 0.6;
  if (convertedSalary <= 100_000_000)
    return 45_200_000 + (convertedSalary - 70_000_000) * 0.55;
  if (convertedSalary <= 300_000_000)
    return 61_700_000 + (convertedSalary - 100_000_000) * 0.45;
  return 151_700_000 + (convertedSalary - 300_000_000) * 0.35;
}

export interface SeveranceTaxInput {
  joinDate: string; // YYYY-MM-DD
  resignDate: string; // YYYY-MM-DD
  severancePay: number; // 세전 퇴직금 총액
}

export interface SeveranceTaxResult {
  workedYears: number; // 세법상 근속연수 (1년 미만은 1년으로 올림)
  serviceYearDeduction: number;
  convertedSalary: number;
  convertedSalaryDeduction: number;
  taxBase: number;
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;
  netSeverancePay: number;
  effectiveTaxRate: number;
}

export function calculateSeveranceTax({
  joinDate,
  resignDate,
  severancePay,
}: SeveranceTaxInput): SeveranceTaxResult {
  const join = new Date(joinDate);
  const resign = new Date(resignDate);
  const workedYears = workedYearsForTax(join, resign);

  const yearDeduction = serviceYearDeduction(workedYears);
  const convertedSalary = Math.max(
    0,
    ((severancePay - yearDeduction) / workedYears) * 12
  );
  const salaryDeduction = convertedSalaryDeduction(convertedSalary);
  const taxBase = Math.max(0, convertedSalary - salaryDeduction);

  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.upTo)!;
  const annualizedTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);
  const incomeTax = Math.round((annualizedTax / 12) * workedYears);
  const localIncomeTax = Math.round(incomeTax * 0.1);
  const totalTax = incomeTax + localIncomeTax;
  const netSeverancePay = Math.max(0, severancePay - totalTax);
  const effectiveTaxRate =
    severancePay > 0 ? (totalTax / severancePay) * 100 : 0;

  return {
    workedYears,
    serviceYearDeduction: yearDeduction,
    convertedSalary: Math.round(convertedSalary),
    convertedSalaryDeduction: Math.round(salaryDeduction),
    taxBase: Math.round(taxBase),
    incomeTax,
    localIncomeTax,
    totalTax,
    netSeverancePay,
    effectiveTaxRate,
  };
}
