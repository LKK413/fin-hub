export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: string;
}

export const articles: ArticleMeta[] = [
  {
    slug: "salary-net-pay-table-2026",
    title: "2026년 연봉 실수령액표",
    description:
      "2,500만원부터 1억 5천만원까지, 연봉별 4대보험·소득세 공제 후 월 실수령액을 한눈에 확인하세요.",
    publishedAt: "2026-08-20",
    category: "연봉",
  },
  {
    slug: "severance-tax-explained",
    title: "퇴직금 세금, 얼마나 떼일까? 퇴직소득세 완전정리",
    description:
      "퇴직금은 일반 근로소득세가 아닌 퇴직소득세로 별도 계산됩니다. 근속연수공제부터 실수령액까지 계산 방식을 예시와 함께 정리했습니다.",
    publishedAt: "2026-08-20",
    category: "퇴직금",
  },
  {
    slug: "loan-repayment-comparison",
    title: "원리금균등 vs 원금균등, 내 대출엔 뭐가 유리할까",
    description:
      "두 상환 방식의 차이와 실제 총이자 비교, 상황별로 어떤 방식이 유리한지 실제 계산으로 알아봅니다.",
    publishedAt: "2026-08-20",
    category: "대출",
  },
  {
    slug: "salary-deductions-guide",
    title: "연봉에서 빠지는 4대보험·세금 공제 항목 총정리",
    description:
      "국민연금, 건강보험, 장기요양보험, 고용보험, 소득세까지 — 연봉에서 실제로 얼마씩 공제되는지 항목별로 정리했습니다.",
    publishedAt: "2026-08-27",
    category: "연봉",
  },
  {
    slug: "loan-rate-impact",
    title: "대출 금리가 1% 오르면 이자는 얼마나 늘어날까?",
    description:
      "같은 대출금과 기간이라도 금리에 따라 월 상환액과 총이자가 얼마나 달라지는지 실제 계산으로 비교해봅니다.",
    publishedAt: "2026-08-27",
    category: "대출",
  },
  {
    slug: "severance-payment-timing",
    title: "퇴직금 지급 기준과 지급 시기",
    description:
      "누가 퇴직금을 받을 수 있고, 언제까지 지급되어야 하는지 근로기준법·근로자퇴직급여보장법 기준으로 정리했습니다.",
    publishedAt: "2026-08-27",
    category: "퇴직금",
  },
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
