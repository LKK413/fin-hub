import type { Metadata } from "next";
import SavingsCalculatorClient from "./SavingsCalculatorClient";

const title = "예금·적금 이자 계산기 | 단리·복리 비교 | Reko";
const description =
  "예치금 또는 월 납입액과 금리, 기간을 입력해 세전·세후 이자와 만기 수령액을 계산해보세요.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/savings" },
  openGraph: { title, description, url: "/calculator/savings" },
};

export default function SavingsCalculatorPage() {
  return <SavingsCalculatorClient />;
}
