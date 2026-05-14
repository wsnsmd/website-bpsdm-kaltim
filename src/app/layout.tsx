// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BPSDM Provinsi Kalimantan Timur",
    template: "%s — BPSDM Kaltim",
  },
  description:
    "Badan Pengembangan Sumber Daya Manusia Provinsi Kalimantan Timur. Pusat pengembangan kompetensi aparatur sipil negara yang profesional dan berintegritas.",
  keywords: [
    "BPSDM Kaltim",
    "Kalimantan Timur",
    "Diklat ASN",
    "Pelatihan PNS",
    "Pengembangan SDM",
  ],
  authors: [{ name: "BPSDM Provinsi Kalimantan Timur" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e3d20",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${playfair.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans antialiased bg-white text-ink">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
