import type { Metadata } from "next";
import PensionCalculatorClient from "./PensionCalculatorClient";

const title = "국민연금 예상 수령액 계산기 | Reko";
const description =
  "평균소득과 가입기간을 입력하면 예상 국민연금 월 수령액을 간이 추정해볼 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/pension" },
  openGraph: { title, description, url: "/calculator/pension" },
};

export default function PensionCalculatorPage() {
  return <PensionCalculatorClient />;
}
