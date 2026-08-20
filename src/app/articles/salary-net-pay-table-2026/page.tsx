import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { calculateSalary } from "@/lib/calculators/salary";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("salary-net-pay-table-2026")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
};

const SALARY_BRACKETS_10K = [
  2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 8000, 9000,
  10000, 12000, 15000,
];

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

function formatManwonLabel(manwon: number): string {
  if (manwon < 10_000) return `${manwon.toLocaleString("ko-KR")}만원`;
  const eok = Math.floor(manwon / 10_000);
  const rest = manwon % 10_000;
  return rest === 0
    ? `${eok}억원`
    : `${eok}억 ${rest.toLocaleString("ko-KR")}만원`;
}

export default function Page() {
  const rows = SALARY_BRACKETS_10K.map((manwon) => {
    const annualGrossSalary = manwon * 10_000;
    const result = calculateSalary({
      annualGrossSalary,
      dependents: 1,
      childrenUnder20: 0,
    });
    return { manwon, ...result };
  });

  return (
    <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <ArticleHeader article={article} />

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          연봉 실수령액은 세전 연봉에서 4대보험료와 소득세를 공제한 뒤 실제로
          통장에 들어오는 금액을 말합니다. 아래 표는 부양가족 1인(본인만
          해당) 기준으로 계산한 연봉별 예상 월 실수령액입니다. 부양가족이나
          8세 이상 자녀가 있다면 인적공제와 자녀세액공제가 추가로 적용되어
          실제 수령액은 이보다 조금 더 많을 수 있습니다.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-zinc-950 text-amber-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">연봉</th>
              <th className="px-4 py-3 text-right font-medium">월 실수령액</th>
              <th className="px-4 py-3 text-right font-medium">월 공제액</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.manwon}
                className="border-t border-zinc-100 hover:bg-zinc-50"
              >
                <td className="px-4 py-2.5 text-zinc-700">
                  {formatManwonLabel(row.manwon)}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-zinc-900">
                  {formatWon(row.monthlyNetSalary)}
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-400">
                  -{formatWon(row.totalDeduction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          표는 어떻게 계산했나요?
        </h2>
        <p>
          국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험료의
          12.95%), 고용보험(0.9%)을 공제하고, 근로소득공제·인적공제·4대보험료
          소득공제를 반영한 과세표준에 소득세 기본세율을 적용해 계산했습니다.
          계산 방식은{" "}
          <Link
            href="/calculator/salary"
            className="text-amber-600 underline hover:text-amber-700"
          >
            연봉 실수령액 계산기
          </Link>
          와 동일합니다.
        </p>
        <p>
          부양가족 수, 8세 이상 자녀 수에 따라 실수령액이 달라지므로, 본인의
          정확한 조건으로 직접 계산해보시는 걸 추천합니다. 4대보험 요율과
          소득세 구간은 매년 개정될 수 있어 이 표는 참고용 추정치입니다.
        </p>
      </div>

      <AdUnit slot="8944805429" />
    </article>
  );
}
