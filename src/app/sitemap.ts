// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getLatestPosts } from "@/lib/queries/posts";
import { getPrograms } from "@/lib/queries/programs";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE}/berita`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/program`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/program/jadwal`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE}/profil`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/ppid`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
    {
      url: `${BASE}/unduhan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.65,
    },
  ];

  const [posts, programs] = await Promise.all([
    getLatestPosts({ limit: 500 }),
    getPrograms({ limit: 100 }),
  ]);

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/berita/${p.slug}`,
    lastModified: p.publishedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const programRoutes: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${BASE}/program/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...postRoutes, ...programRoutes];
}

export default sitemap;
