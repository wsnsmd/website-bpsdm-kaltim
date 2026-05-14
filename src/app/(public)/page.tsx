// src/app/(public)/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { QuickServices } from "@/components/home/QuickServices";
import { NewsSection } from "@/components/home/NewsSection";
import { ProgramsSection } from "@/components/home/ProgramsSection";
import { AgendaSection } from "@/components/home/AgendaSection";
import { getLatestPosts, getFeaturedPost } from "@/lib/queries/posts";
import { getUpcomingSchedules } from "@/lib/queries/programs";
import { getActiveAnnouncements } from "@/lib/queries/announcements";

export default async function HomePage() {
  // Fetch semua data paralel — tidak saling menunggu
  const [featuredPost, latestPosts, schedules, announcements] =
    await Promise.all([
      getFeaturedPost(),
      getLatestPosts({ limit: 6 }),
      getUpcomingSchedules({ limit: 3 }),
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
      <AgendaSection schedules={schedules} />
    </>
  );
}
