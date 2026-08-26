import type { Metadata } from "next";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

const title = "연봉 실수령액 계산기 2026 | Reko";
const description =
  "연봉을 입력하면 국민연금, 건강보험, 고용보험, 소득세 등을 반영한 예상 월 실수령액을 간편하게 계산할 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/salary" },
  openGraph: { title, description, url: "/calculator/salary" },
};

export default function SalaryCalculatorPage() {
  return <SalaryCalculatorClient />;
}
