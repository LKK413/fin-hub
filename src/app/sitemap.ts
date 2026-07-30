import type { MetadataRoute } from "next";

const BASE_URL = "https://fin-hub-eight.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/calculator/salary", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/calculator/loan", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/rates", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.1 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.1 },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
