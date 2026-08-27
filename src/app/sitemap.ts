import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";

const BASE_URL = "https://www.reko.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/calculator/salary", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/loan", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/severance", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/severance-tax", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/savings", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/year-end-tax", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/pension", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/unemployment", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/rent-conversion", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/rates", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/articles", changeFrequency: "weekly" as const, priority: 0.7 },
    ...articles.map((article) => ({
      path: `/articles/${article.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/contact", changeFrequency: "yearly" as const, priority: 0.2 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.1 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.1 },
    { path: "/disclaimer", changeFrequency: "yearly" as const, priority: 0.1 },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
