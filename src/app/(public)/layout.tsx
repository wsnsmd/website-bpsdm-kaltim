// src/app/(public)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { SurveyWidget } from "@/components/survei/SurveyWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <VisitorTracker />
      <Header />
      <HeaderSpacer />
      <main>{children}</main>
      <Footer />
      <SurveyWidget />
    </>
  );
}
