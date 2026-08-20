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
];

export function getArticle(slug: string): ArticleMeta | undefined {
  return articles.find((a) => a.slug === slug);
}
