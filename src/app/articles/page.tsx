import type { Metadata } from "next";
import { ArrowRight, BookOpen } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "정보 | Reko",
  description:
    "연봉, 퇴직금, 대출 상환까지 — 재테크 계산에 필요한 배경지식을 정리했습니다.",
  alternates: { canonical: "/articles" },
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-amber-400">
          <BookOpen className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <h1 className="font-display text-2xl font-bold">정보</h1>
      </div>
      <p className="mt-3 text-zinc-600">
        연봉, 퇴직금, 대출 상환까지 — 재테크 계산에 필요한 배경지식을 정리했습니다.
      </p>

      <div className="mt-8 space-y-4">
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group relative block overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg hover:shadow-zinc-200/60"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
              {article.category}
            </p>
            <h2 className="mt-1.5 font-display font-semibold text-zinc-900">
              {article.title}
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">{article.description}</p>
            <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-amber-500" />
          </a>
        ))}
      </div>
    </div>
  );
}
