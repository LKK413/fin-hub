export type RepaymentType = "equalInstallment" | "equalPrincipal";

export interface LoanInput {
  principal: number;
  annualRatePercent: number;
  months: number;
  repaymentType: RepaymentType;
}

export interface LoanMonthlyRow {
  month: number;
  payment: number;
  principalPortion: number;
  interestPortion: number;
  remainingBalance: number;
}

export interface LoanResult {
  schedule: LoanMonthlyRow[];
  totalPayment: number;
  totalInterest: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
}

export function calculateLoan({
  principal,
  annualRatePercent,
  months,
  repaymentType,
}: LoanInput): LoanResult {
  const monthlyRate = annualRatePercent / 100 / 12;
  const schedule: LoanMonthlyRow[] = [];
  let remaining = principal;

  if (repaymentType === "equalInstallment") {
    const payment =
      monthlyRate === 0
        ? principal / months
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    for (let month = 1; month <= months; month++) {
      const interestPortion = Math.round(remaining * monthlyRate);
      const principalPortion = Math.round(payment) - interestPortion;
      remaining = Math.max(0, remaining - principalPortion);
      schedule.push({
        month,
        payment: Math.round(payment),
        principalPortion,
        interestPortion,
        remainingBalance: remaining,
      });
    }
  } else {
    const principalPortion = Math.round(principal / months);
    for (let month = 1; month <= months; month++) {
      const interestPortion = Math.round(remaining * monthlyRate);
      const isLast = month === months;
      const thisPrincipal = isLast ? remaining : principalPortion;
      remaining = Math.max(0, remaining - thisPrincipal);
      schedule.push({
        month,
        payment: thisPrincipal + interestPortion,
        principalPortion: thisPrincipal,
        interestPortion,
        remainingBalance: remaining,
      });
    }
  }

  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interestPortion, 0);

  return {
    schedule,
    totalPayment,
    totalInterest,
    firstMonthPayment: schedule[0]?.payment ?? 0,
    lastMonthPayment: schedule[schedule.length - 1]?.payment ?? 0,
  };
}
