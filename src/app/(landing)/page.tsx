// src/app/(public)/page.tsx
import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Portal Layanan Digital",
  description:
    "Portal layanan digital terpadu Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur.",
};

export default function RootPage() {
  return <LandingPage />;
}
