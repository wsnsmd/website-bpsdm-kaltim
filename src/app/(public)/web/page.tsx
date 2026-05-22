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
// import { PimpinanSection } from "@/components/home/PimpinanSection";
// import { getAllPimpinan } from "@/lib/queries/profil";
import { SnapController } from "@/components/home/SnapController";

export const revalidate = 3600;

export default async function HomePage() {
  const [
    featuredPost,
    latestPosts,
    jadwalMendatang,
    announcements,
    // pimpinanStaff,
  ] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts({ limit: 6 }),
    fetchJadwalMendatang(4),
    getActiveAnnouncements(5),
    // getAllPimpinan(),
  ]);

  // const ACCENT_COLORS = [
  //   { accent: "#2d6a3f", accentAlt: "#fbbf24" },
  //   { accent: "#1d4ed8", accentAlt: "#60a5fa" },
  //   { accent: "#7e22ce", accentAlt: "#c084fc" },
  //   { accent: "#c2410c", accentAlt: "#fb923c" },
  //   { accent: "#0e7490", accentAlt: "#22d3ee" },
  // ];

  // const pimpinanData = pimpinanStaff.map((s, i) => ({
  //   id: s.id,
  //   name: s.name,
  //   position: s.position ?? "Pimpinan",
  //   photo: s.photo,
  //   bio: s.bio ? s.bio.replace(/<[^>]*>/g, "").slice(0, 120) + "..." : null,
  //   href: "/profil/kepala-badan",
  //   accent: ACCENT_COLORS[i % ACCENT_COLORS.length].accent,
  //   accentAlt: ACCENT_COLORS[i % ACCENT_COLORS.length].accentAlt,
  // }));

  return (
    <>
      <SnapController />
      <HeroSection
        featuredPost={featuredPost}
        recentPosts={latestPosts.slice(0, 3)}
      />
      <AnnouncementBar announcements={announcements} />
      <QuickServices />
      <div style={{ height: "1px", backgroundColor: "var(--color-ink-6)" }} />
      {/* {pimpinanData.length > 0 && <PimpinanSection pimpinan={pimpinanData} />} */}
      <NewsSection featuredPost={featuredPost} posts={latestPosts} />
      <div style={{ height: "1px", backgroundColor: "var(--color-ink-6)" }} />
      <ProgramsSection />
      <AgendaSection jadwalList={jadwalMendatang} />
    </>
  );
}
