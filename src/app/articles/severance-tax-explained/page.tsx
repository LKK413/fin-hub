import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("severance-tax-explained")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
  alternates: { canonical: "/articles/severance-tax-explained" },
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

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          퇴직금을 받으면 다른 소득과 합산해 세금을 매길 것 같지만, 실제로는
          그렇지 않습니다. 퇴직소득은 근로소득과 별도로{" "}
          <strong>퇴직소득세</strong>라는 독립된 세목으로 분류과세됩니다.
          근속연수가 길수록, 그리고 퇴직금이 여러 해에 걸쳐 쌓인 돈이라는
          점을 반영해 세 부담을 크게 낮춰주는 구조라, 실제 실효세율은
          체감보다 훨씬 낮은 경우가 많습니다.
        </p>
      </div>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-700">
        <h2 className="text-base font-semibold text-zinc-800">
          계산 순서 4단계
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong>근속연수공제</strong>: 오래 다닐수록 공제액이 커집니다.
            5년 이하는 &quot;100만원 × 근속연수&quot;, 5~10년은 &quot;500만원
            + 200만원 × (근속연수-5)&quot; 식으로 구간별로 계단식 계산됩니다.
          </li>
          <li>
            <strong>환산급여</strong>: (퇴직금 − 근속연수공제) ÷ 근속연수 ×
            12. 퇴직금을 근속 연수만큼 나눠 받은 것처럼 환산해 세율 구간을
            낮추는 효과가 있습니다.
          </li>
          <li>
            <strong>환산급여공제</strong>: 환산급여가 클수록 공제율이
            낮아지는 구조로, 800만원 이하는 전액, 그 이상 구간은 60%→55%→
            45%→35%로 단계적으로 줄어듭니다.
          </li>
          <li>
            <strong>세액 계산</strong>: (환산급여 − 환산급여공제)에 종합소득세
            기본세율(6~45%)을 적용한 뒤, 다시 근속연수로 나눠 실제 낼 세금을
            구합니다. 여기에 지방소득세(세액의 10%)가 더해집니다.
          </li>
        </ol>
      </section>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-700">
        <h2 className="text-base font-semibold text-zinc-800">
          예시로 보기: 근속 10년, 퇴직금 5,000만원
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[380px] text-sm">
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">근속연수공제</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  1,500만원
                </td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">환산급여</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  4,200만원
                </td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">환산급여공제</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  2,840만원
                </td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">
                  퇴직소득세 + 지방소득세
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  약 74.8만원
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium text-zinc-700">
                  실수령 퇴직금
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-amber-700">
                  약 4,925만원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          실효세율이 1.5% 정도로 매우 낮습니다. 근로소득세와 비교하면 왜
          퇴직소득세가 &quot;세금 부담이 적은 소득&quot;으로 불리는지 알 수
          있는 대목입니다.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          참고하세요
        </h2>
        <p>
          이 글의 계산식과 공제 구간은 매년 개정될 수 있으며, 근속연수·퇴직금
          액수에 따라 세율 구간이 달라져 실제 세액은 차이가 날 수 있습니다.
          Reko의{" "}
          <Link
            href="/calculator/severance"
            className="text-amber-600 underline hover:text-amber-700"
          >
            퇴직금 계산기
          </Link>
          는 세전 퇴직금(회사가 지급하는 총액)을 계산하는 도구이며, 이 글에서
          설명한 퇴직소득세는 별도로 원천징수됩니다. 정확한 세액은 국세청
          홈택스나 회사 인사팀을 통해 확인하시기 바랍니다.
        </p>
      </section>

      <div className="mt-8">
        <h2 className="text-base font-semibold text-zinc-800">함께 보면 좋은 글</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Link
            href="/articles/severance-payment-timing"
            className="rounded-lg border border-zinc-200 bg-white p-3 text-sm text-zinc-700 hover:border-amber-300"
          >
            퇴직금 지급 기준과 지급 시기
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
