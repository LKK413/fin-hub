import {
  RATES,
  TAX_BRACKETS,
  earnedIncomeDeduction,
  earnedIncomeTaxCredit,
  childTaxCredit,
} from "./salary";

// 연금저축+IRP 합산 세액공제 한도(2023년 개정) 및 공제율
const PENSION_SAVING_LIMIT = 9_000_000;
const PENSION_SAVING_RATE_LOW_INCOME = 0.15; // 총급여 5,500만원 이하
const PENSION_SAVING_RATE_HIGH_INCOME = 0.12;
const PENSION_SAVING_LOW_INCOME_THRESHOLD = 55_000_000;

// 보장성보험료 세액공제
const INSURANCE_PREMIUM_LIMIT = 1_000_000;
const INSURANCE_PREMIUM_RATE = 0.12;

// 의료비 세액공제 — 총급여 3% 초과분에 대해, 공제대상금액 한도 700만원
const MEDICAL_EXPENSE_INCOME_THRESHOLD_RATE = 0.03;
const MEDICAL_EXPENSE_DEDUCTION_BASE_LIMIT = 7_000_000;
const MEDICAL_EXPENSE_RATE = 0.15;

// 교육비 세액공제
const EDUCATION_EXPENSE_RATE = 0.15;

// 기부금 세액공제 — 1천만원 이하 15%, 초과분 30%
const DONATION_TIER_LIMIT = 10_000_000;
const DONATION_RATE_LOW = 0.15;
const DONATION_RATE_HIGH = 0.3;

// 신용카드 등 사용금액 소득공제
const CARD_SPENDING_INCOME_THRESHOLD_RATE = 0.25;
const CREDIT_CARD_RATE = 0.15;
const DEBIT_CASH_RATE = 0.3;

function creditCardDeductionLimit(annualGrossSalary: number): number {
  if (annualGrossSalary <= 70_000_000) return 3_000_000;
  if (annualGrossSalary <= 120_000_000) return 2_500_000;
  return 2_000_000;
}

export interface YearEndTaxInput {
  annualGrossSalary: number;
  dependents: number;
  childrenUnder20: number;
  creditCardSpending: number;
  debitCashReceiptSpending: number;
  pensionSavingContribution: number;
  insurancePremium: number;
  medicalExpense: number;
  educationExpense: number;
  donationAmount: number;
  alreadyWithheldTax: number; // 이미 원천징수로 납부한 소득세+지방소득세 총액
}

export interface YearEndTaxResult {
  taxBase: number;
  calculatedTax: number;
  earnedIncomeTaxCreditAmount: number;
  childTaxCreditAmount: number;
  pensionSavingCredit: number;
  insurancePremiumCredit: number;
  medicalExpenseCredit: number;
  educationExpenseCredit: number;
  donationCredit: number;
  creditCardDeduction: number;
  totalTaxCredit: number;
  finalTax: number; // 결정세액(소득세)
  finalLocalTax: number; // 결정세액(지방소득세)
  totalFinalTax: number;
  refundOrDue: number; // 양수: 환급, 음수: 추가 납부
}

export function calculateYearEndTax({
  annualGrossSalary,
  dependents,
  childrenUnder20,
  creditCardSpending,
  debitCashReceiptSpending,
  pensionSavingContribution,
  insurancePremium,
  medicalExpense,
  educationExpense,
  donationAmount,
  alreadyWithheldTax,
}: YearEndTaxInput): YearEndTaxResult {
  const monthlyGross = annualGrossSalary / 12;
  const pensionBase = Math.min(
    Math.max(monthlyGross, RATES.nationalPensionFloorMonthly),
    RATES.nationalPensionCapMonthly
  );
  const nationalPension = Math.round(pensionBase * RATES.nationalPension);
  const healthInsurance = Math.round(monthlyGross * RATES.healthInsurance);
  const longTermCare = Math.round(healthInsurance * RATES.longTermCareOfHealth);
  const employmentInsurance = Math.round(monthlyGross * RATES.employmentInsurance);
  const annualSocialInsurance =
    (nationalPension + healthInsurance + longTermCare + employmentInsurance) * 12;

  // 신용카드 등 소득공제: 총급여 25% 초과분부터, 신용카드 먼저 소진 후 체크카드·현금영수증 순
  const threshold = annualGrossSalary * CARD_SPENDING_INCOME_THRESHOLD_RATE;
  const creditUsedForThreshold = Math.min(creditCardSpending, threshold);
  const creditExcess = creditCardSpending - creditUsedForThreshold;
  const remainingThreshold = threshold - creditUsedForThreshold;
  const debitUsedForThreshold = Math.min(debitCashReceiptSpending, remainingThreshold);
  const debitExcess = debitCashReceiptSpending - debitUsedForThreshold;
  const creditCardDeduction = Math.min(
    creditExcess * CREDIT_CARD_RATE + debitExcess * DEBIT_CASH_RATE,
    creditCardDeductionLimit(annualGrossSalary)
  );

  const earnedDeduction = earnedIncomeDeduction(annualGrossSalary);
  const personalDeduction = Math.max(dependents, 1) * 1_500_000;

  const taxBase = Math.max(
    0,
    annualGrossSalary -
      earnedDeduction -
      personalDeduction -
      annualSocialInsurance -
      creditCardDeduction
  );

  const bracket = TAX_BRACKETS.find((b) => taxBase <= b.upTo)!;
  const calculatedTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);

  const earnedCredit = earnedIncomeTaxCredit(calculatedTax, annualGrossSalary);
  const childCredit = childTaxCredit(childrenUnder20);

  const pensionSavingCredit =
    Math.min(pensionSavingContribution, PENSION_SAVING_LIMIT) *
    (annualGrossSalary <= PENSION_SAVING_LOW_INCOME_THRESHOLD
      ? PENSION_SAVING_RATE_LOW_INCOME
      : PENSION_SAVING_RATE_HIGH_INCOME);

  const insurancePremiumCredit =
    Math.min(insurancePremium, INSURANCE_PREMIUM_LIMIT) * INSURANCE_PREMIUM_RATE;

  const medicalDeductionBase = Math.min(
    Math.max(0, medicalExpense - annualGrossSalary * MEDICAL_EXPENSE_INCOME_THRESHOLD_RATE),
    MEDICAL_EXPENSE_DEDUCTION_BASE_LIMIT
  );
  const medicalExpenseCredit = medicalDeductionBase * MEDICAL_EXPENSE_RATE;

  const educationExpenseCredit = educationExpense * EDUCATION_EXPENSE_RATE;

  const donationCredit =
    Math.min(donationAmount, DONATION_TIER_LIMIT) * DONATION_RATE_LOW +
    Math.max(0, donationAmount - DONATION_TIER_LIMIT) * DONATION_RATE_HIGH;

  const totalTaxCredit =
    earnedCredit +
    childCredit +
    pensionSavingCredit +
    insurancePremiumCredit +
    medicalExpenseCredit +
    educationExpenseCredit +
    donationCredit;

  const finalTax = Math.max(0, Math.round(calculatedTax - totalTaxCredit));
  const finalLocalTax = Math.round(finalTax * 0.1);
  const totalFinalTax = finalTax + finalLocalTax;

  return {
    taxBase: Math.round(taxBase),
    calculatedTax: Math.round(calculatedTax),
    earnedIncomeTaxCreditAmount: Math.round(earnedCredit),
    childTaxCreditAmount: childCredit,
    pensionSavingCredit: Math.round(pensionSavingCredit),
    insurancePremiumCredit: Math.round(insurancePremiumCredit),
    medicalExpenseCredit: Math.round(medicalExpenseCredit),
    educationExpenseCredit: Math.round(educationExpenseCredit),
    donationCredit: Math.round(donationCredit),
    creditCardDeduction: Math.round(creditCardDeduction),
    totalTaxCredit: Math.round(totalTaxCredit),
    finalTax,
    finalLocalTax,
    totalFinalTax,
    refundOrDue: alreadyWithheldTax - totalFinalTax,
  };
}
