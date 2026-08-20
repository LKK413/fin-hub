import type { ArticleMeta } from "@/lib/articles";

export function ArticleHeader({ article }: { article: ArticleMeta }) {
  return (
    <header>
      <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
        {article.category}
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
        {article.title}
      </h1>
      <p className="mt-3 text-zinc-600">{article.description}</p>
      <time
        dateTime={article.publishedAt}
        className="mt-2 block text-xs text-zinc-400"
      >
        {article.publishedAt} 작성
      </time>
    </header>
  );
}
