import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { calculateSalary, RATES } from "@/lib/calculators/salary";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("salary-deductions-guide")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
  alternates: { canonical: "/articles/salary-deductions-guide" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  dateModified: article.publishedAt,
  author: { "@type": "Organization", name: "Reko" },
};

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(rate * 100 < 1 ? 3 : 2).replace(/\.?0+$/, "")}%`;
}

export default function Page() {
  const example = calculateSalary({
    annualGrossSalary: 40_000_000,
    dependents: 1,
    childrenUnder20: 0,
  });

  const items = [
    {
      name: "국민연금",
      rate: formatPercent(RATES.nationalPension),
      amount: example.nationalPension,
      description:
        "노후 소득 보장을 위한 사회보험으로, 기준소득월액의 일정 비율을 근로자와 회사가 절반씩 부담합니다.",
    },
    {
      name: "건강보험",
      rate: formatPercent(RATES.healthInsurance),
      amount: example.healthInsurance,
      description: "질병·부상에 대한 의료비를 보장하는 사회보험입니다.",
    },
    {
      name: "장기요양보험",
      rate: `건강보험료의 ${formatPercent(RATES.longTermCareOfHealth)}`,
      amount: example.longTermCare,
      description: "고령이나 노인성 질병으로 인한 장기요양을 지원하는 보험으로, 건강보험료에 비례해 산정됩니다.",
    },
    {
      name: "고용보험",
      rate: formatPercent(RATES.employmentInsurance),
      amount: example.employmentInsurance,
      description: "실업급여, 고용안정 사업 등에 사용되는 보험료입니다.",
    },
    {
      name: "소득세",
      rate: "누진세율 6~45%",
      amount: example.incomeTax,
      description:
        "근로소득공제·인적공제·4대보험료 소득공제를 반영한 과세표준에 기본세율을 적용한 뒤, 근로소득세액공제 등을 차감해 계산합니다.",
    },
    {
      name: "지방소득세",
      rate: "소득세의 10%",
      amount: example.localIncomeTax,
      description: "소득세액에 비례해 지방자치단체에 납부하는 세금입니다.",
    },
  ];

  return (
    <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeader article={article} />

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          연봉 계약서에 적힌 금액과 매달 통장에 들어오는 금액이 다른 이유는
          4대보험료와 세금이 원천징수되기 때문입니다. 각 항목이 무엇이고
          얼마나 공제되는지 연봉 4,000만원(부양가족 1인 기준)을 예시로
          정리했습니다.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-zinc-950 text-amber-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">항목</th>
              <th className="px-4 py-3 text-left font-medium">요율</th>
              <th className="px-4 py-3 text-right font-medium">월 공제액 (예시)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-t border-zinc-100">
                <td className="px-4 py-2.5 font-medium text-zinc-800">
                  {item.name}
                </td>
                <td className="px-4 py-2.5 text-zinc-500">{item.rate}</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(item.amount)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-zinc-200 font-medium">
              <td className="px-4 py-2.5" colSpan={2}>
                공제액 합계
              </td>
              <td className="px-4 py-2.5 text-right">
                {formatWon(example.totalDeduction)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-4 text-sm leading-6 text-zinc-700">
        {items.map((item) => (
          <p key={item.name}>
            <strong>{item.name}</strong> — {item.description}
          </p>
        ))}
      </div>

      <div className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          공제액이 사람마다 다른 이유
        </h2>
        <p>
          국민연금·건강보험·고용보험은 월급 수준에 따라 정해지지만, 소득세는
          부양가족 수, 8세 이상 자녀 수, 비과세 항목(식대 등) 여부에 따라
          달라집니다. 같은 연봉이라도 회사의 급여 처리 방식이나 개인의 공제
          조건에 따라 실수령액이 다를 수 있습니다.
        </p>
        <p>
          내 연봉 기준 실제 공제액과 실수령액이 궁금하다면{" "}
          <Link
            href="/calculator/salary"
            className="text-amber-600 underline hover:text-amber-700"
          >
            연봉 실수령액 계산기
          </Link>
          에서 직접 계산해보세요.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>계산 기준: 2025년 요율 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.nps.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국민연금공단
          </a>
          ,{" "}
          <a
            href="https://www.nhis.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국민건강보험공단
          </a>
          ,{" "}
          <a
            href="https://www.nts.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            국세청
          </a>
        </p>
        <p className="mt-2">
          이 페이지의 정보는 참고용이며, 실제 공제액은 회사의 급여 규정이나
          개인별 조건에 따라 달라질 수 있습니다.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/articles/salary-net-pay-table-2026"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            2026년 연봉 실수령액표
          </Link>
          <Link
            href="/calculator/salary"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            연봉 실수령액 계산기 바로가기
          </Link>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </article>
  );
}
