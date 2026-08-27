import type { Metadata } from "next";
import YearEndTaxCalculatorClient from "./YearEndTaxCalculatorClient";

const title = "연말정산 환급액 계산기 | Reko";
const description =
  "신용카드 사용액, 연금저축, 보험료, 의료비, 교육비, 기부금 등을 입력해 예상 연말정산 환급액(또는 추가 납부액)을 계산해보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/year-end-tax" },
  openGraph: { title, description, url: "/calculator/year-end-tax" },
};

export default function YearEndTaxCalculatorPage() {
  return <YearEndTaxCalculatorClient />;
}
