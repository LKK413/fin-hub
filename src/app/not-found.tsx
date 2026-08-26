import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata = {
  title: "페이지를 찾을 수 없습니다 | Reko",
};

const popularLinks = [
  { href: "/calculator/salary", label: "연봉 실수령액 계산기" },
  { href: "/calculator/loan", label: "대출이자 계산기" },
  { href: "/calculator/severance", label: "퇴직금 계산기" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-amber-400">
        <Compass className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold text-zinc-900">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        요청하신 주소가 삭제되었거나 잘못 입력되었을 수 있습니다.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 active:scale-[0.98]"
      >
        홈으로 이동
      </Link>

      <div className="mt-10 w-full">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          인기 계산기
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {popularLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 transition-colors hover:border-amber-300 hover:text-amber-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
