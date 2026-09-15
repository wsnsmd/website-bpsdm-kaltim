// src/app/(public)/layout.tsx
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import {
  SurveyWidget,
  VisitorTracker,
} from "@/components/layout/ClientComponents";
import { BackToTop } from "@/components/ui/BackToTop";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
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
  const waNumber = await getSetting("contact_whatsapp");
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
      {waNumber && (
        <WhatsAppButton
          number={waNumber}
          message="Halo BPSDM Kaltim, saya ingin bertanya"
        />
      )}
      <SurveyWidget />
    </>
  );
}
