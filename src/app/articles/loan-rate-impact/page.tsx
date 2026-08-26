import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { calculateLoan } from "@/lib/calculators/loan";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("loan-rate-impact")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
  alternates: { canonical: "/articles/loan-rate-impact" },
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

const PRINCIPAL = 100_000_000;
const MONTHS = 360;
const RATES_TO_COMPARE = [3, 4, 5, 6];

export default function Page() {
  const rows = RATES_TO_COMPARE.map((rate) => {
    const result = calculateLoan({
      principal: PRINCIPAL,
      annualRatePercent: rate,
      months: MONTHS,
      repaymentType: "equalInstallment",
    });
    return { rate, ...result };
  });

  const base = rows[0];
  const highest = rows[rows.length - 1];

  return (
    <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeader article={article} />

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          같은 금액을 빌려도 금리가 조금만 달라지면 월 상환액과 총이자는
          크게 벌어집니다. 1억원을 30년(360개월) 만기, 원리금균등상환
          방식으로 빌렸을 때 금리별로 어떻게 달라지는지 계산해봤습니다.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-zinc-950 text-amber-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">금리</th>
              <th className="px-4 py-3 text-right font-medium">월 상환액</th>
              <th className="px-4 py-3 text-right font-medium">총 이자</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rate} className="border-t border-zinc-100">
                <td className="px-4 py-2.5 font-medium text-zinc-800">
                  연 {row.rate}%
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(row.firstMonthPayment)}
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-500">
                  {formatWon(row.totalInterest)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          금리 1%p 차이가 만드는 실제 격차
        </h2>
        <p>
          위 표를 보면 연 {base.rate}%에서 연 {highest.rate}%로 금리가{" "}
          {highest.rate - base.rate}%p 오르면, 월 상환액은{" "}
          {formatWon(highest.firstMonthPayment - base.firstMonthPayment)}
          만큼, 30년간 내는 총이자는{" "}
          {formatWon(highest.totalInterest - base.totalInterest)}
          만큼 늘어납니다. 금리가 낮아 보여도 대출 기간이 길수록 이 차이는
          누적되어 크게 벌어집니다.
        </p>
        <p>
          변동금리 대출이라면 금리가 오를 때 월 상환액 부담이 어느 정도까지
          늘어날 수 있는지 미리 가늠해두는 것이 좋습니다.
        </p>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          내 대출 조건으로 직접 계산해보기
        </h2>
        <p>
          대출 금액, 금리, 기간을 직접 입력해서 원리금균등·원금균등 방식별
          월 상환액과 총이자를 비교하고 싶다면{" "}
          <Link
            href="/calculator/loan"
            className="text-amber-600 underline hover:text-amber-700"
          >
            대출이자 계산기
          </Link>
          를 이용해보세요.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>
          계산 기준: 원리금균등상환, 고정금리 가정 · 최종 업데이트: 2026년 8월
          27일
        </p>
        <p className="mt-1">
          참고 자료:{" "}
          <a
            href="https://www.fss.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            금융감독원
          </a>
          ,{" "}
          <a
            href="https://www.bok.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            한국은행
          </a>
        </p>
        <p className="mt-2">
          실제 금융기관의 금리, 중도상환수수료, 변동금리 조건 등에 따라
          결과는 달라질 수 있습니다.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/articles/loan-repayment-comparison"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            원리금균등 vs 원금균등 비교
          </Link>
          <Link
            href="/calculator/loan"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            대출이자 계산기 바로가기
          </Link>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </article>
  );
}
