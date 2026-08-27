import type { Metadata } from "next";
import SeveranceTaxCalculatorClient from "./SeveranceTaxCalculatorClient";

const title = "퇴직소득세 계산기 | 세후 퇴직금 계산 | Reko";
const description =
  "근속연수와 세전 퇴직금을 입력하면 근속연수공제·환산급여공제를 반영한 퇴직소득세와 세후 실수령액을 계산할 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/severance-tax" },
  openGraph: { title, description, url: "/calculator/severance-tax" },
};

export default function SeveranceTaxCalculatorPage() {
  return <SeveranceTaxCalculatorClient />;
}
