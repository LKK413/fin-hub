import type { Metadata } from "next";
import SeveranceCalculatorClient from "./SeveranceCalculatorClient";

const title = "퇴직금 계산기 2026 | 예상 퇴직금 간편 계산 | Reko";
const description = "근무기간과 급여를 입력하면 예상 퇴직금을 간편하게 계산할 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/severance" },
  openGraph: { title, description, url: "/calculator/severance" },
};

export default function SeveranceCalculatorPage() {
  return <SeveranceCalculatorClient />;
}
