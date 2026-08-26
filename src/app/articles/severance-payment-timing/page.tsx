import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("severance-payment-timing")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
  alternates: { canonical: "/articles/severance-payment-timing" },
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

export default function Page() {
  return (
    <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleHeader article={article} />

      <div className="mt-8 space-y-8 text-sm leading-6 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            누가 퇴직금을 받을 수 있나요?
          </h2>
          <p className="mt-2">
            근로기준법과 근로자퇴직급여보장법에 따라, 계속근로기간이 1년
            이상이고 4주간을 평균하여 1주간의 소정근로시간이 15시간 이상인
            근로자에게 퇴직금이 지급됩니다. 정규직뿐 아니라 이 조건을
            충족하는 계약직·아르바이트도 동일하게 대상이 됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            근속기간은 어떻게 계산하나요?
          </h2>
          <p className="mt-2">
            근속기간은 실제 입사일부터 퇴사일까지의 재직일수를 기준으로
            합니다. 수습기간이나 육아휴직 기간도 근로계약이 유지되는 한
            일반적으로 근속기간에 포함됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            퇴직금은 언제까지 지급되어야 하나요?
          </h2>
          <p className="mt-2">
            근로자퇴직급여보장법 제9조에 따라 사용자는 근로자가 퇴직한
            날부터 14일 이내에 퇴직금을 지급해야 합니다. 다만 특별한 사정이
            있는 경우 당사자 간 합의로 지급 기일을 연장할 수 있습니다. 정당한
            사유 없이 기한 내 지급하지 않으면 지연일수에 대한 지연이자가
            발생할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            퇴직금과 퇴직연금, 무엇이 다른가요?
          </h2>
          <p className="mt-2">
            퇴직금은 회사가 사내에 적립해두었다가 퇴직 시 일시금으로
            지급하는 방식입니다. 반면 퇴직연금은 회사가 매년 부담금을
            금융기관에 적립해 운용하는 제도로, 확정급여형(DB)과
            확정기여형(DC)으로 나뉩니다. DB형은 퇴직 시 받는 금액이 근속연수와
            평균임금에 따라 정해져 있고, DC형은 운용 성과에 따라 수령액이
            달라질 수 있습니다. 회사가 퇴직연금 제도를 도입했다면, 실제
            수령액과 지급 절차는 해당 제도의 약관을 따릅니다.
          </p>
        </section>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          내 퇴직금이 얼마인지 궁금하다면
        </h2>
        <p>
          입사일, 퇴사일, 최근 3개월 임금을 입력하면 근로기준법 기준으로
          예상 퇴직금을 계산해볼 수 있습니다.{" "}
          <Link
            href="/calculator/severance"
            className="text-amber-600 underline hover:text-amber-700"
          >
            퇴직금 계산기
          </Link>
          에서 확인해보세요.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-6 text-zinc-500">
        <p>기준: 근로기준법, 근로자퇴직급여보장법 · 최종 업데이트: 2026년 8월 27일</p>
        <p className="mt-1">
          공식 출처:{" "}
          <a
            href="https://www.moel.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            고용노동부
          </a>
          ,{" "}
          <a
            href="https://www.comwel.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-amber-600"
          >
            근로복지공단
          </a>
        </p>
        <p className="mt-2">
          이 페이지의 내용은 일반적인 안내이며, 개별 사업장의 취업규칙이나
          단체협약, 퇴직연금 제도에 따라 실제 지급 방식은 달라질 수
          있습니다.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/articles/severance-tax-explained"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직소득세 완전정리
          </Link>
          <Link
            href="/calculator/severance"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직금 계산기 바로가기
          </Link>
        </div>
      </div>

      <AdUnit slot="8944805429" />
    </article>
  );
}
