// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getPublicSettings } from "@/lib/queries/settings";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getPublicSettings();

  const siteName = s.site_name ?? "BPSDM Provinsi Kalimantan Timur";
  const siteDesc =
    s.site_description ??
    "Pusat pengembangan kompetensi ASN Kalimantan Timur — mendorong profesionalisme, integritas, dan inovasi pelayanan publik.";

  return {
    metadataBase: new URL(SITE_URL),

    title: {
      default: siteName,
      template: `%s — ${siteName}`,
    },
    description: siteDesc,

    keywords: [
      "BPSDM Kalimantan Timur",
      "diklat ASN Kaltim",
      "pelatihan aparatur",
      "pengembangan kompetensi",
      "pemerintah Kaltim",
      "LAN",
    ],

    authors: [{ name: siteName, url: SITE_URL }],
    creator: siteName,
    publisher: siteName,

    // Open Graph
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: SITE_URL,
      siteName,
      title: siteName,
      description: siteDesc,
      images: [
        {
          url: `${SITE_URL}/og-default.png`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDesc,
      images: [`${SITE_URL}/og-default.png`],
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Canonical
    alternates: {
      canonical: SITE_URL,
      languages: { "id-ID": SITE_URL },
    },

    // Icons
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    manifest: "/manifest.json",

    // Verifikasi Google Search Console
    verification: {
      google: s.google_site_verification ?? "",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#071a0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getPublicSettings();
  const GA_ID = s.ga4_id ?? process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {GA_ID && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}
        <link rel="dns-prefetch" href="https://simpel.kaltimprov.go.id" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="font-sans antialiased">
        {/* GA4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
