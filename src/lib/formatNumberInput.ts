// 금액 입력창에 타이핑하는 동안 천단위 쉼표를 자동으로 붙여주는 헬퍼.
// 숫자가 아닌 문자는 모두 제거한 뒤 다시 쉼표를 넣어 반환한다.
export function formatNumberInput(value: string): string {
  const digits = value.replace(/[^0-9]/g, "");
  if (!digits) return "";
  // 앞자리 불필요한 0 제거(단, "0" 한 글자는 유지)
  const normalized = digits.replace(/^0+(?=\d)/, "");
  return Number(normalized).toLocaleString("ko-KR");
}
