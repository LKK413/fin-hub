import type { Metadata } from "next";
import SalaryCalculatorClient from "./SalaryCalculatorClient";

export const metadata: Metadata = {
  title: "연봉 실수령액 계산기 | Reko",
  description:
    "연봉 실수령액 계산기 — 국민연금·건강보험·소득세 등 4대보험과 세금을 반영한 정확한 월 실수령액을 확인하세요.",
  alternates: { canonical: "/calculator/salary" },
};

export default function SalaryCalculatorPage() {
  return <SalaryCalculatorClient />;
}
