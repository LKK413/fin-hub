export const metadata = {
  title: "개인정보처리방침 | Reko",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-zinc-400">시행일자: 2026년 7월 30일</p>

      <div className="mt-8 space-y-8 text-sm leading-6 text-zinc-700">
        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            1. 수집하는 정보 및 목적
          </h2>
          <p className="mt-2">
            Reko(이하 &quot;사이트&quot;)는 계산기 및 정보 제공 서비스를
            제공하며, 회원가입 없이 이용할 수 있습니다. 계산기에 입력한
            값(연봉, 대출금액 등)은 서버로 전송되거나 저장되지 않고
            브라우저에서만 계산됩니다. 사이트 이용 과정에서 접속 로그, IP
            주소, 쿠키, 방문 일시 등이 서비스 개선 및 광고 게재를 위해
            자동으로 수집될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            2. 쿠키(Cookie)의 운영 및 광고
          </h2>
          <p className="mt-2">
            사이트는 Google AdSense를 비롯한 제3자 광고 서비스를 이용합니다.
            Google과 같은 제3자 공급업체는 쿠키를 사용하여 이용자가
            사이트나 다른 사이트를 방문한 기록을 바탕으로 광고를 게재합니다.
            Google이 광고 쿠키를 사용함에 따라 사이트 이용자는{" "}
            <a
              href="https://adssettings.google.com/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 선택 해제할 수 있습니다.
          </p>
          <p className="mt-2">
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있으며, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            3. 개인정보의 제3자 제공
          </h2>
          <p className="mt-2">
            사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지
            않습니다. 다만 광고 게재를 위해 Google AdSense 등 광고 파트너가
            자체 개인정보처리방침에 따라 정보를 수집·이용할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            4. 개인정보의 보유 및 이용기간
          </h2>
          <p className="mt-2">
            자동 수집되는 접속 로그 등의 정보는 서비스 운영 목적 달성 후
            관련 법령에 따른 보관 기간을 준수하여 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            5. 문의처
          </h2>
          <p className="mt-2">
            개인정보 관련 문의사항은 아래 이메일로 연락해 주시기 바랍니다.
          </p>
          <p className="mt-2">이메일: foruarla@gmail.com</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-zinc-900">
            6. 개정
          </h2>
          <p className="mt-2">
            본 방침은 법령 및 정책 변경에 따라 수정될 수 있으며, 변경 시
            사이트를 통해 공지합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
