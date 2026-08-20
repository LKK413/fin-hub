import type { Metadata } from "next";
import SeveranceCalculatorClient from "./SeveranceCalculatorClient";

export const metadata: Metadata = {
  title: "퇴직금 계산기 | Reko",
  description:
    "퇴직금 계산기 — 평균임금 기준으로 예상 퇴직금을 정확하게 계산해보세요.",
};

export default function SeveranceCalculatorPage() {
  return <SeveranceCalculatorClient />;
}
