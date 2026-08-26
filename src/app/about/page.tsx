import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reko 소개 | 재테크 계산기 서비스",
  description:
    "Reko가 어떤 서비스인지, 왜 만들어졌는지, 어떤 계산기를 제공하는지 소개합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">Reko 소개</h1>

      <div className="mt-8 space-y-8 text-sm leading-6 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            Reko는 어떤 서비스인가요?
          </h2>
          <p className="mt-2">
            Reko는 연봉, 대출, 퇴직금처럼 살면서 한 번쯤 계산해봐야 하는
            재테크 관련 숫자를 빠르고 정확하게 확인할 수 있도록 돕는 금융
            계산 서비스입니다. 국민연금·건강보험 요율, 소득세 누진세율,
            근로기준법상 퇴직금 산정 방식처럼 직접 계산하기 번거로운 공식을
            대신 계산해서, 몇 가지 값만 입력하면 바로 예상 결과를 확인할 수
            있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            왜 Reko를 만들었나요?
          </h2>
          <p className="mt-2">
            연봉 협상, 대출 상담, 퇴사를 앞두고 있을 때 &quot;그래서 내가
            실제로 받는 돈은 얼마일까?&quot;라는 질문에 정확히 답하기는
            생각보다 어렵습니다. 검색해도 계산 방식만 설명하는 글이 많고,
            직접 계산해보려면 여러 요율과 공제 항목을 일일이 찾아야 합니다.
            Reko는 이런 계산을 한 곳에서 끝낼 수 있도록, 계산기와 계산
            방식에 대한 설명을 함께 제공하는 것을 목표로 만들어졌습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            어떤 계산기를 제공하나요?
          </h2>
          <p className="mt-2">
            현재{" "}
            <a href="/calculator/salary" className="underline hover:text-amber-600">
              연봉 실수령액 계산기
            </a>
            ,{" "}
            <a href="/calculator/loan" className="underline hover:text-amber-600">
              대출이자 계산기
            </a>
            ,{" "}
            <a href="/calculator/severance" className="underline hover:text-amber-600">
              퇴직금 계산기
            </a>
            와 매일 자동으로 갱신되는{" "}
            <a href="/rates" className="underline hover:text-amber-600">
              환율 정보
            </a>
            를 제공하고 있습니다. 각 계산기 페이지에는 계산 결과뿐 아니라
            계산 방식과 자주 묻는 질문도 함께 정리해 두었습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            계산 결과는 어떤 목적으로 제공되나요?
          </h2>
          <p className="mt-2">
            Reko의 계산 결과는 사용자가 자신의 상황을 빠르게 가늠해볼 수
            있도록 돕는 참고용 정보입니다. 회사의 급여 규정이나 금융기관의
            실제 대출 조건, 개인별 공제 사항에 따라 실제 금액과 차이가
            발생할 수 있으며, 정확한 금액은 국세청·4대보험공단 등 관련 기관
            또는 전문가를 통해 확인하는 것을 권장합니다. 보다 자세한 내용은{" "}
            <a href="/disclaimer" className="underline hover:text-amber-600">
              면책조항
            </a>
            을 참고해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">문의</h2>
          <p className="mt-2">
            서비스 이용 중 궁금한 점이 있다면{" "}
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
