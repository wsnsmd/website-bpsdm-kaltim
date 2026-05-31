// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { db, eq, desc } from "@/db";
import { posts, programs } from "@/db/schema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Tanggal deploy / build — lebih stabil dari new Date() setiap request
const BUILD_TIME = new Date();

const STATIC_PAGES = [
  { path: "/web", priority: 1.0, changeFreq: "daily" },
  { path: "/berita", priority: 0.9, changeFreq: "daily" },
  { path: "/program", priority: 0.9, changeFreq: "weekly" },
  { path: "/program/jadwal", priority: 0.9, changeFreq: "daily" },
  { path: "/profil", priority: 0.8, changeFreq: "monthly" },
  { path: "/profil/sejarah", priority: 0.6, changeFreq: "monthly" },
  { path: "/profil/visi-misi", priority: 0.6, changeFreq: "monthly" },
  { path: "/profil/struktur-organisasi", priority: 0.6, changeFreq: "monthly" },
  { path: "/ppid", priority: 0.7, changeFreq: "monthly" },
  { path: "/pengumuman", priority: 0.7, changeFreq: "daily" },
  { path: "/layanan", priority: 0.7, changeFreq: "monthly" },
  { path: "/unduhan", priority: 0.7, changeFreq: "weekly" },
  { path: "/kontak", priority: 0.6, changeFreq: "monthly" },
  { path: "/pengaduan", priority: 0.6, changeFreq: "monthly" },
  { path: "/maklumat-pelayanan", priority: 0.5, changeFreq: "monthly" },
  { path: "/survei", priority: 0.5, changeFreq: "monthly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: BUILD_TIME,
    changeFrequency: p.changeFreq,
    priority: p.priority,
  }));

  // ─── Berita ───────────────────────────────────────────────────────────────
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const allPosts = await db
      .select({
        slug: posts.slug,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
      })
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt))
      .limit(500);

    postEntries = allPosts.map((p) => ({
      url: `${SITE_URL}/berita/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? BUILD_TIME,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    /* skip */
  }

  // ─── Program ──────────────────────────────────────────────────────────────
  let programEntries: MetadataRoute.Sitemap = [];
  try {
    const allPrograms = await db
      .select({
        slug: programs.slug,
        updatedAt: programs.updatedAt,
      })
      .from(programs)
      .where(eq(programs.status, "active")) // sesuai schema Anda
      .limit(200);

    programEntries = allPrograms.map((p) => ({
      url: `${SITE_URL}/program/${p.slug}`,
      lastModified: p.updatedAt ?? BUILD_TIME,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* skip */
  }

  return [...staticEntries, ...postEntries, ...programEntries];
}
