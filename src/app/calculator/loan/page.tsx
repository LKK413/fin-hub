import type { Metadata } from "next";
import LoanCalculatorClient from "./LoanCalculatorClient";

const title = "대출 이자 계산기 | 원리금균등·원금균등 비교 | Reko";
const description =
  "대출금액, 금리, 기간을 입력해 월 상환금과 총 이자를 계산하고 상환 방식별 차이를 비교해보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/loan" },
  openGraph: { title, description, url: "/calculator/loan" },
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
