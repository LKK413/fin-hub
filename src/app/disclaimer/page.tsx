import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "면책조항 | Reko",
  description:
    "Reko는 금융기관, 세무법인, 법률사무소, 투자자문사가 아니며 제공되는 정보와 계산 결과는 참고용입니다.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">면책조항</h1>
      <p className="mt-2 text-sm text-zinc-400">시행일자: 2026년 7월 30일</p>

      <div className="mt-8 space-y-8 text-sm leading-6 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            Reko는 어떤 서비스인가요?
          </h2>
          <p className="mt-2">
            Reko는 연봉, 대출, 퇴직금 등 생활에 필요한 금융 계산을 쉽게 할 수
            있도록 돕는 정보 제공 서비스입니다. Reko는 금융기관, 세무법인,
            법률사무소, 투자자문사가 아니며, 그와 같은 지위에서 상담이나
            자문을 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            계산 결과의 성격
          </h2>
          <p className="mt-2">
            Reko의 모든 계산기는 일반적으로 알려진 계산 방식을 기준으로
            예상 금액을 추정해서 보여줍니다. 회사의 급여 규정, 개인의 공제
            조건, 금융기관의 실제 대출 약정, 관련 법령의 최신 개정 여부 등에
            따라 실제 금액과 차이가 발생할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            법률·세무 자문이 아닙니다
          </h2>
          <p className="mt-2">
            사이트에 게재된 설명과 가이드 콘텐츠는 이해를 돕기 위한 일반적인
            정보이며, 개별 상황에 대한 법률·세무 자문을 대체하지 않습니다.
            구체적인 의사결정이 필요한 경우 국세청, 고용노동부, 국민연금공단,
            국민건강보험공단 등 관련 공식 기관이나 세무사·노무사 등 전문가와
            상담하시기를 권장합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            책임의 제한
          </h2>
          <p className="mt-2">
            Reko는 계산 결과 및 콘텐츠의 정확성을 보장하기 위해 노력하지만,
            이를 근거로 한 이용자의 판단이나 의사결정에 대해서는 책임을 지지
            않습니다. 자세한 면책 사항은{" "}
            <a href="/terms" className="underline hover:text-amber-600">
              이용약관
            </a>
            을 함께 참고해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">문의</h2>
          <p className="mt-2">
            면책조항과 관련해 궁금한 점이 있다면{" "}
            <a
              href="mailto:contact@reko.co.kr"
              className="underline hover:text-amber-600"
            >
              contact@reko.co.kr
            </a>
            로 연락해 주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
