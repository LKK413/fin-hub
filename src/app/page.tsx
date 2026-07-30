import { Banknote, Landmark, Briefcase, RefreshCw, ArrowRight } from "lucide-react";
import type { ComponentType } from "react";

const calculators: {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  color: string;
  available: boolean;
}[] = [
  {
    href: "/calculator/salary",
    title: "연봉 실수령액 계산기",
    description: "4대보험과 소득세를 반영한 월 실수령액을 계산합니다.",
    icon: Banknote,
    color: "bg-emerald-500",
    available: true,
  },
  {
    href: "/calculator/loan",
    title: "대출이자 계산기",
    description: "원리금균등·원금균등 상환 방식별 월 상환액을 비교합니다.",
    icon: Landmark,
    color: "bg-blue-500",
    available: true,
  },
  {
    href: "/calculator/severance",
    title: "퇴직금 계산기",
    description: "평균임금 기준 예상 퇴직금을 계산합니다.",
    icon: Briefcase,
    color: "bg-amber-500",
    available: true,
  },
  {
    href: "/rates",
    title: "오늘의 환율",
    description: "한국수출입은행 매매기준율을 매일 자동으로 갱신합니다.",
    icon: RefreshCw,
    color: "bg-violet-500",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            복잡한 재테크 계산,
            <br className="sm:hidden" /> 핀허브가 대신합니다
          </h1>
          <p className="mt-4 text-zinc-600">
            연봉, 대출, 퇴직금까지 — 몇 초 안에 정확한 예상 금액을 확인하세요.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <a
                key={calc.title}
                href={calc.available ? calc.href : undefined}
                className={`group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all ${
                  calc.available
                    ? "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${calc.color} text-white`}>
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h2 className="mt-4 font-semibold text-zinc-900">{calc.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{calc.description}</p>
                {calc.available ? (
                  <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400" />
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
