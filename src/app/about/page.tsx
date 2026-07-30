export const metadata = {
  title: "사이트 소개 | 핀허브",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <h1 className="text-2xl font-bold">핀허브 소개</h1>

      <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-700">
        <p>
          핀허브는 연봉, 대출이자 등 실생활에 필요한 재테크 계산을 빠르고
          정확하게 할 수 있도록 돕는 계산기 모음 사이트입니다. 복잡한
          세금·보험료 계산 방식을 몰라도 몇 가지 정보만 입력하면 바로
          결과를 확인할 수 있습니다.
        </p>
        <p>
          환율 등 자주 확인하는 금융 정보는 매일 자동으로 갱신해 최신
          정보를 제공하는 것을 목표로 합니다.
        </p>
        <p>
          제공되는 모든 계산 결과는 참고용이며, 법적·세무적 효력이 없습니다.
          정확한 금액은 관련 기관의 공식 자료를 확인하시기 바랍니다.
        </p>
        <p>문의: iceprince040413@gmail.com</p>
      </div>
    </div>
  );
}
