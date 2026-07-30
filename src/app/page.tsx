const calculators = [
  {
    href: "/calculator/salary",
    title: "연봉 실수령액 계산기",
    description: "4대보험과 소득세를 반영한 월 실수령액을 계산합니다.",
    available: true,
  },
  {
    href: "/calculator/loan",
    title: "대출이자 계산기",
    description: "원리금균등·원금균등 상환 방식별 월 상환액을 비교합니다.",
    available: true,
  },
  {
    href: "/calculator/severance",
    title: "퇴직금 계산기",
    description: "평균임금 기준 예상 퇴직금을 계산합니다.",
    available: true,
  },
  {
    href: "/rates",
    title: "오늘의 환율",
    description: "한국수출입은행 매매기준율을 매일 자동으로 갱신합니다.",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">재테크 계산기</h1>
      <p className="mt-2 text-zinc-600">
        복잡한 세금·보험료 계산을 대신 해드립니다.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {calculators.map((calc) => (
          <a
            key={calc.title}
            href={calc.available ? calc.href : undefined}
            className={`rounded-lg border border-zinc-200 bg-white p-5 transition-colors ${
              calc.available
                ? "hover:border-zinc-400"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <h2 className="font-semibold">{calc.title}</h2>
            <p className="mt-1 text-sm text-zinc-500">{calc.description}</p>
            {!calc.available && (
              <span className="mt-2 inline-block text-xs text-zinc-400">
                준비 중
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
