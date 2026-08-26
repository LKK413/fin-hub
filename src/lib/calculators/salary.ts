// 2025년 기준 요율 — 매년 개정되므로 연 1회 확인 필요
export const RATES = {
  nationalPension: 0.045, // 국민연금 (근로자 부담)
  nationalPensionCapMonthly: 6_370_000, // 기준소득월액 상한
  nationalPensionFloorMonthly: 390_000, // 기준소득월액 하한
  healthInsurance: 0.03545, // 건강보험
  longTermCareOfHealth: 0.1295, // 장기요양보험 (건강보험료 대비)
  employmentInsurance: 0.009, // 고용보험
};

// 소득세 기본세율 (연 과세표준 기준, 8단계)
const TAX_BRACKETS = [
  { upTo: 14_000_000, rate: 0.06, deduction: 0 },
  { upTo: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upTo: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upTo: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upTo: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upTo: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { upTo: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upTo: Infinity, rate: 0.45, deduction: 65_940_000 },
];

function earnedIncomeDeduction(grossAnnual: number): number {
  if (grossAnnual <= 5_000_000) return grossAnnual * 0.7;
  if (grossAnnual <= 15_000_000) return 3_500_000 + (grossAnnual - 5_000_000) * 0.4;
  if (grossAnnual <= 45_000_000) return 7_500_000 + (grossAnnual - 15_000_000) * 0.15;
  if (grossAnnual <= 100_000_000) return 12_000_000 + (grossAnnual - 45_000_000) * 0.05;
  return 14_750_000 + (grossAnnual - 100_000_000) * 0.02;
}

function earnedIncomeTaxCredit(calculatedTax: number, grossAnnual: number): number {
  const base = calculatedTax <= 1_300_000 ? calculatedTax * 0.55 : 715_000 + (calculatedTax - 1_300_000) * 0.3;
  let cap: number;
  if (grossAnnual <= 33_000_000) cap = 740_000;
  else if (grossAnnual <= 70_000_000) cap = Math.max(660_000, 740_000 - (grossAnnual - 33_000_000) * 0.008);
  else if (grossAnnual <= 120_000_000) cap = Math.max(500_000, 660_000 - (grossAnnual - 70_000_000) * 0.0005);
  else cap = Math.max(200_000, 500_000 - (grossAnnual - 120_000_000) * 0.0005);
  return Math.min(base, cap);
}

// 자녀세액공제 (8세 이상 기본공제대상 자녀, 산출세액에서 직접 차감)
function childTaxCredit(childrenUnder20: number): number {
  if (childrenUnder20 <= 0) return 0;
  if (childrenUnder20 === 1) return 150_000;
  if (childrenUnder20 === 2) return 350_000;
  return 350_000 + (childrenUnder20 - 2) * 300_000;
}

export interface SalaryInput {
  annualGrossSalary: number;
  dependents: number; // 본인 포함 부양가족 수 (최소 1)
  childrenUnder20: number; // 8세 이상 20세 이하 자녀 수 (자녀세액공제용)
}

export interface SalaryResult {
  annualGrossSalary: number;
  monthlyGrossSalary: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeduction: number;
  monthlyNetSalary: number;
  annualNetSalary: number;
}

export function calculateSalary({
  annualGrossSalary,
  dependents,
  childrenUnder20,
}: SalaryInput): SalaryResult {
  const monthlyGross = annualGrossSalary / 12;

  const pensionBase = Math.min(
    Math.max(monthlyGross, RATES.nationalPensionFloorMonthly),
    RATES.nationalPensionCapMonthly
  );
  const nationalPension = Math.round(pensionBase * RATES.nationalPension);

  const healthInsurance = Math.round(monthlyGross * RATES.healthInsurance);
  const longTermCare = Math.round(healthInsurance * RATES.longTermCareOfHealth);
  const employmentInsurance = Math.round(monthlyGross * RATES.employmentInsurance);

  // 국민연금·건강보험·장기요양보험·고용보험 근로자 부담분은 전액 소득공제(특별소득공제) 대상
  const annualSocialInsurance =
    (nationalPension + healthInsurance + longTermCare + employmentInsurance) * 12;

  const earnedDeduction = earnedIncomeDeduction(annualGrossSalary);
  const personalDeduction = Math.max(dependents, 1) * 1_500_000;

  const taxBase = Math.max(
    0,
    annualGrossSalary - earnedDeduction - personalDeduction - annualSocialInsurance
  );

  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.upTo)!;
  const calculatedTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);
  const earnedCredit = earnedIncomeTaxCredit(calculatedTax, annualGrossSalary);
  const childCredit = childTaxCredit(childrenUnder20);
  const annualIncomeTax = Math.max(0, Math.round(calculatedTax - earnedCredit - childCredit));
  const monthlyIncomeTax = Math.round(annualIncomeTax / 12);
  const monthlyLocalTax = Math.round(monthlyIncomeTax * 0.1);

  const monthlyTotalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    monthlyIncomeTax +
    monthlyLocalTax;

  const monthlyNet = Math.round(monthlyGross - monthlyTotalDeduction);

  return {
    annualGrossSalary,
    monthlyGrossSalary: Math.round(monthlyGross),
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax: monthlyIncomeTax,
    localIncomeTax: monthlyLocalTax,
    totalDeduction: monthlyTotalDeduction,
    monthlyNetSalary: monthlyNet,
    annualNetSalary: monthlyNet * 12,
  };
}
