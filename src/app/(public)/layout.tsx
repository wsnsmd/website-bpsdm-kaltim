// src/app/(public)/layout.tsx
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/ui/PageTransition";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import {
  SurveyWidget,
  VisitorTracker,
} from "@/components/layout/ClientComponents";
import { BackToTop } from "@/components/ui/BackToTop";
import { redirect } from "next/navigation";
import { getSetting } from "@/lib/queries/settings";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await getSetting("maintenance_mode");
  if (maintenance === "true") {
    redirect("/maintenance");
  }
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <VisitorTracker />
      <Header />
      <HeaderSpacer />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <SurveyWidget />
    </>
  );
}
