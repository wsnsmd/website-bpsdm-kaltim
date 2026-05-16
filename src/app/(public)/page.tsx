// src/app/(public)/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { QuickServices } from "@/components/home/QuickServices";
import { NewsSection } from "@/components/home/NewsSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { AgendaSection } from "@/components/home/AgendaSection";
import { getLatestPosts, getFeaturedPost } from "@/lib/queries/posts";
import { getActiveAnnouncements } from "@/lib/queries/announcements";
import { fetchJadwalMendatang } from "@/lib/simpel/jadwal";

export const revalidate = 3600;

export default async function HomePage() {
  const [featuredPost, latestPosts, jadwalMendatang, announcements] =
    await Promise.all([
      getFeaturedPost(),
      getLatestPosts({ limit: 6 }),
      fetchJadwalMendatang(4),
      getActiveAnnouncements(5),
    ]);

  return (
    <>
      <HeroSection
        featuredPost={featuredPost}
        recentPosts={latestPosts.slice(0, 3)}
      />
      <AnnouncementBar announcements={announcements} />
      <QuickServices />
      <div style={{ height: "1px", backgroundColor: "var(--color-ink-6)" }} />
      <NewsSection featuredPost={featuredPost} posts={latestPosts} />
      <div style={{ height: "1px", backgroundColor: "var(--color-ink-6)" }} />
      <ProgramsSection />
      <AgendaSection jadwalList={jadwalMendatang} />
    </>
  );
}
