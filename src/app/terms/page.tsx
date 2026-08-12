export const metadata = {
  title: "이용약관 | Reko",
};

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">이용약관</h1>
      <p className="mt-2 text-sm text-zinc-400">시행일자: 2026년 7월 30일</p>

      <div className="mt-8 space-y-8 text-sm leading-6 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제1조 (목적)
          </h2>
          <p className="mt-2">
            이 약관은 Reko(이하 &quot;사이트&quot;)가 제공하는 재테크
            계산기 및 금융 정보 서비스(이하 &quot;서비스&quot;)의 이용과
            관련하여 사이트와 이용자 간의 권리, 의무 및 책임사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제2조 (서비스의 내용)
          </h2>
          <p className="mt-2">
            사이트는 연봉 실수령액, 대출이자 등 계산기와 환율·금리 등
            금융 정보를 무료로 제공합니다. 별도의 회원가입 절차 없이
            누구나 이용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제3조 (면책조항)
          </h2>
          <p className="mt-2">
            사이트가 제공하는 계산 결과 및 정보는 참고용 추정치이며 법적
            효력이 없습니다. 사이트는 계산 결과의 정확성을 보장하지
            않으며, 이를 근거로 한 의사결정에 대해 책임을 지지 않습니다.
            정확한 금액은 국세청, 4대보험공단, 금융기관 등 관련 기관을
            통해 확인하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제4조 (저작권)
          </h2>
          <p className="mt-2">
            사이트에 게시된 콘텐츠에 대한 저작권은 사이트 운영자에게
            있으며, 무단 복제 및 배포를 금지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제5조 (약관의 변경)
          </h2>
          <p className="mt-2">
            본 약관은 관련 법령 및 서비스 정책에 따라 변경될 수 있으며,
            변경 시 사이트를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            제6조 (문의)
          </h2>
          <p className="mt-2">
            서비스 이용과 관련한 문의는 foruarla@gmail.com 으로
            연락해 주시기 바랍니다.
          </p>
        </section>
      </div>
    </div>
  );
}
