import type { Metadata } from "next";
import UnemploymentCalculatorClient from "./UnemploymentCalculatorClient";

const title = "실업급여 계산기 | 구직급여 예상 수급액 | Reko";
const description =
  "평균임금과 고용보험 가입기간을 입력하면 예상 구직급여일액과 총 수급액을 계산할 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/unemployment" },
  openGraph: { title, description, url: "/calculator/unemployment" },
};

export default function UnemploymentCalculatorPage() {
  return <UnemploymentCalculatorClient />;
}
