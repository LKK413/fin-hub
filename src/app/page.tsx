import type { Metadata } from "next";
import { Banknote, HandCoins, Briefcase, RefreshCw, ArrowRight, BookOpen } from "lucide-react";
import type { ComponentType } from "react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Reko — 연봉·대출·퇴직금 계산기 & 금융 정보",
  description:
    "연봉 실수령액, 대출이자, 퇴직금 계산을 한 곳에서. 계산 방식 설명과 자주 묻는 질문까지 함께 제공하는 재테크 계산 서비스입니다.",
  alternates: { canonical: "/" },
};

const calculators: {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  iconAnimationClass: string;
  available: boolean;
}[] = [
  {
    href: "/calculator/salary",
    title: "연봉 실수령액 계산기",
    description: "4대보험과 소득세를 반영한 월 실수령액을 계산합니다.",
    icon: Banknote,
    iconAnimationClass: "animate-icon-flip",
    available: true,
  },
  {
    href: "/calculator/loan",
    title: "대출이자 계산기",
    description: "원리금균등·원금균등 상환 방식별 월 상환액을 비교합니다.",
    icon: HandCoins,
    iconAnimationClass: "animate-icon-coin-drop",
    available: true,
  },
  {
    href: "/calculator/severance",
    title: "퇴직금 계산기",
    description: "평균임금 기준 예상 퇴직금을 계산합니다.",
    icon: Briefcase,
    iconAnimationClass: "animate-icon-swing",
    available: true,
  },
  {
    href: "/rates",
    title: "오늘의 환율",
    description: "한국수출입은행 매매기준율을 매일 자동으로 갱신합니다.",
    icon: RefreshCw,
    iconAnimationClass: "animate-icon-spin",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400">
            Personal Finance, Refined
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            복잡한 재테크 계산,
            <br className="sm:hidden" /> Reko가 대신합니다
          </h1>
          <p className="mx-auto mt-5 max-w-md text-zinc-400">
            연봉, 대출, 퇴직금까지 — 몇 초 안에 정확한 예상 금액을 확인하세요.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <a
                key={calc.title}
                href={calc.available ? calc.href : undefined}
                className={`group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 transition-all ${
                  calc.available
                    ? "hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-xl hover:shadow-zinc-200/60"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
                  <Icon
                    className={`h-5 w-5 ${calc.iconAnimationClass}`}
                    strokeWidth={1.75}
                  />
                </div>
                <h2 className="mt-4 font-display font-semibold text-zinc-900">{calc.title}</h2>
                <p className="mt-1.5 text-sm text-zinc-500">{calc.description}</p>
                {calc.available ? (
                  <ArrowRight className="absolute right-6 top-6 h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-amber-500" />
                ) : (
                  <span className="mt-3 inline-block text-xs text-zinc-400">
                    준비 중
                  </span>
                )}
              </a>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          계산 결과는 이해를 돕기 위한 참고용 정보이며, 실제 급여·세금·대출
          조건과 차이가 있을 수 있습니다.
        </p>
      </div>

      <div className="border-t border-zinc-200 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-xl font-bold text-zinc-900">
            Reko는 어떤 서비스인가요?
          </h2>
          <div className="mt-4 max-w-2xl space-y-4 text-sm leading-6 text-zinc-600">
            <p>
              연봉 협상, 대출 상담, 퇴사를 앞두고 있을 때 &quot;그래서 실제로
              받는 돈은 얼마일까?&quot;라는 질문에 답하려면 국민연금·건강보험
              요율부터 소득세 누진세율, 근로기준법상 퇴직금 산정 방식까지
              여러 정보를 챙겨야 합니다. Reko는 이런 계산을 한 곳에서 끝낼 수
              있도록 계산기와 계산 방식 설명을 함께 제공합니다.
            </p>
            <p>
              단순히 숫자만 보여주는 대신, 각 계산기 아래에 공제 항목이나
              상환 방식 같은 배경 지식과 자주 묻는 질문을 정리해 두어서
              결과를 왜 그렇게 계산했는지도 함께 이해할 수 있도록 만들고
              있습니다.{" "}
              <a href="/about" className="underline hover:text-amber-600">
                Reko 소개 더 보기
              </a>
            </p>
          </div>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="border-t border-zinc-200 bg-zinc-50 py-14">
          <div className="mx-auto max-w-4xl px-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" strokeWidth={1.75} />
              <h2 className="font-display text-xl font-bold text-zinc-900">
                인기 금융 가이드
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <a
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="group block rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-zinc-200/60"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                    {article.category}
                  </p>
                  <h3 className="mt-1.5 font-display text-sm font-semibold text-zinc-900">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">
                    {article.description}
                  </p>
                </a>
              ))}
            </div>
            <a
              href="/articles"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              모든 가이드 보기
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
