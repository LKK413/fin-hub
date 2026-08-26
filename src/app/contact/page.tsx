import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "문의하기 | Reko",
  description:
    "계산 오류 제보, 서비스 문의, 개선 의견, 개인정보 관련 문의를 이메일로 남겨주세요.",
  alternates: { canonical: "/contact" },
};

const topics = [
  {
    title: "계산 오류 제보",
    description:
      "계산 결과가 실제와 다르게 나오는 것 같다면, 어떤 값을 입력했는지와 함께 알려주세요.",
  },
  {
    title: "서비스 문의",
    description: "계산기 사용 방법이나 기능에 대해 궁금한 점을 남겨주세요.",
  },
  {
    title: "개선 의견",
    description: "추가되었으면 하는 계산기나 콘텐츠 아이디어를 제안해주세요.",
  },
  {
    title: "개인정보 관련 문의",
    description:
      "개인정보처리방침과 관련해 궁금한 점이나 요청 사항이 있다면 알려주세요.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <Mail className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">문의하기</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        Reko를 이용하시면서 궁금한 점이나 불편한 점이 있다면 언제든 아래
        이메일로 편하게 연락해 주세요.
      </p>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-zinc-500">문의 이메일</p>
        <a
          href="mailto:contact@reko.co.kr"
          className="mt-1 inline-block font-display text-xl font-bold text-zinc-900 underline decoration-amber-400 decoration-2 underline-offset-4 hover:text-amber-600"
        >
          contact@reko.co.kr
        </a>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">
          이런 내용을 남겨주시면 좋아요
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-zinc-900">
                {topic.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs leading-5 text-zinc-400">
        개인정보 처리에 관한 자세한 내용은{" "}
        <a href="/privacy" className="underline hover:text-amber-600">
          개인정보처리방침
        </a>
        을 참고해 주세요.
      </p>
    </div>
  );
}
