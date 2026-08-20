import type { Metadata } from "next";
import LoanCalculatorClient from "./LoanCalculatorClient";

export const metadata: Metadata = {
  title: "대출이자 계산기 | Reko",
  description:
    "대출이자 계산기 — 원리금균등상환과 원금균등상환 방식별 월 상환액과 총 이자를 비교해보세요.",
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
