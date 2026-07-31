import { Banknote, Landmark, Briefcase, RefreshCw, ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

const calculators: {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  available: boolean;
}[] = [
  {
    href: "/calculator/salary",
    title: "연봉 실수령액 계산기",
    description: "4대보험과 소득세를 반영한 월 실수령액을 계산합니다.",
    icon: Banknote,
    available: true,
  },
  {
    href: "/calculator/loan",
    title: "대출이자 계산기",
    description: "원리금균등·원금균등 상환 방식별 월 상환액을 비교합니다.",
    icon: Landmark,
    available: true,
  },
  {
    href: "/calculator/severance",
    title: "퇴직금 계산기",
    description: "평균임금 기준 예상 퇴직금을 계산합니다.",
    icon: Briefcase,
    available: true,
  },
  {
    href: "/rates",
    title: "오늘의 환율",
    description: "한국수출입은행 매매기준율을 매일 자동으로 갱신합니다.",
    icon: RefreshCw,
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
            <br className="sm:hidden" /> 핀허브가 대신합니다
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
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
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
      </div>
    </div>
  );
}
