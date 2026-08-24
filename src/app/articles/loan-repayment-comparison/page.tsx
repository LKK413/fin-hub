import type { Metadata } from "next";
import Link from "next/link";
import { getArticle } from "@/lib/articles";
import { ArticleHeader } from "@/components/ArticleHeader";
import { calculateLoan } from "@/lib/calculators/loan";
import { AdUnit } from "@/components/AdUnit";

const article = getArticle("loan-repayment-comparison")!;

export const metadata: Metadata = {
  title: `${article.title} | Reko`,
  description: article.description,
  alternates: { canonical: "/articles/loan-repayment-comparison" },
};

function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}

export default function Page() {
  const exampleParams = {
    principal: 100_000_000,
    annualRatePercent: 4.5,
    months: 360,
  };
  const equalInstallment = calculateLoan({
    ...exampleParams,
    repaymentType: "equalInstallment",
  });
  const equalPrincipal = calculateLoan({
    ...exampleParams,
    repaymentType: "equalPrincipal",
  });
  const interestDiff =
    equalInstallment.totalInterest - equalPrincipal.totalInterest;

  return (
    <article className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <ArticleHeader article={article} />

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          대출을 받을 때 은행에서 꼭 물어보는 것 중 하나가 상환 방식입니다.
          같은 원금, 같은 금리라도 <strong>원리금균등상환</strong>과{" "}
          <strong>원금균등상환</strong> 중 무엇을 고르느냐에 따라 매달 나가는
          돈과 총 이자 부담이 달라집니다.
        </p>
        <p>
          원리금균등상환은 매달 갚는 금액(원금+이자)이 대출 기간 내내
          동일합니다. 초기에는 이자 비중이 크고 원금 비중이 작다가, 시간이
          지날수록 원금 비중이 커지는 구조입니다. 원금균등상환은 반대로 매달
          갚는 원금이 항상 동일하고, 이자는 남은 원금에 비례해 매달
          줄어듭니다.
        </p>
      </div>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-700">
        <h2 className="text-base font-semibold text-zinc-800">
          실제 계산으로 비교: 1억원, 연 4.5%, 30년
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[420px] text-sm">
            <thead className="bg-zinc-950 text-amber-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium"></th>
                <th className="px-4 py-3 text-right font-medium">
                  원리금균등
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  원금균등
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">첫 회차 상환액</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(equalInstallment.firstMonthPayment)}
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(equalPrincipal.firstMonthPayment)}
                </td>
              </tr>
              <tr className="border-t border-zinc-100">
                <td className="px-4 py-2.5 text-zinc-500">
                  마지막 회차 상환액
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(equalInstallment.lastMonthPayment)}
                </td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(equalPrincipal.lastMonthPayment)}
                </td>
              </tr>
              <tr className="border-t border-zinc-200 font-medium">
                <td className="px-4 py-2.5 text-zinc-700">총 이자</td>
                <td className="px-4 py-2.5 text-right text-zinc-900">
                  {formatWon(equalInstallment.totalInterest)}
                </td>
                <td className="px-4 py-2.5 text-right text-amber-700">
                  {formatWon(equalPrincipal.totalInterest)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          같은 조건이라도 원금균등상환이 총 이자를 {formatWon(interestDiff)}{" "}
          덜 냅니다. 원금을 더 빨리 갚아나가는 만큼 이자가 붙는 잔액이 더
          빠르게 줄어들기 때문입니다. 대신 초반 상환 부담은 원금균등상환이
          훨씬 큽니다.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-sm leading-6 text-zinc-600">
        <h2 className="text-base font-semibold text-zinc-800">
          어떤 상황에 뭐가 유리할까
        </h2>
        <p>
          <strong>원리금균등상환</strong>은 매달 상환액이 일정해 자금 계획을
          세우기 쉽습니다. 소득이 일정한 직장인이나, 초반 상환 부담을 낮게
          유지하고 싶은 경우에 적합합니다.
        </p>
        <p>
          <strong>원금균등상환</strong>은 초반 부담이 크지만 총 이자를
          아낄 수 있습니다. 초기 자금 여유가 있거나, 은퇴 전까지 대출을
          최대한 빨리 정리하고 싶은 경우에 유리합니다.
        </p>
        <p>
          본인의 대출 조건으로 직접 비교해보고 싶다면{" "}
          <Link
            href="/calculator/loan"
            className="text-amber-600 underline hover:text-amber-700"
          >
            대출이자 계산기
          </Link>
          에서 원금, 금리, 기간을 입력해 두 방식을 바로 비교해보세요.
        </p>
      </section>

      <AdUnit slot="8944805429" />
    </article>
  );
}
