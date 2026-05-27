// src/app/(public)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import {
  SurveyWidget,
  VisitorTracker,
} from "@/components/layout/ClientComponents";
import { BackToTop } from "@/components/ui/BackToTop";
import { redirect } from "next/navigation";
import { getSetting } from "@/lib/queries/settings";

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
