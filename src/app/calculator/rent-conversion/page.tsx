import type { Metadata } from "next";
import RentConversionCalculatorClient from "./RentConversionCalculatorClient";

const title = "전월세 전환 계산기 | 법정 전환율 기준 | Reko";
const description =
  "전세보증금을 월세로, 또는 월세를 전세로 환산해보세요. 주택임대차보호법상 법정 전환율 상한도 함께 확인할 수 있습니다.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculator/rent-conversion" },
  openGraph: { title, description, url: "/calculator/rent-conversion" },
};

export default function RentConversionCalculatorPage() {
  return <RentConversionCalculatorClient />;
}
