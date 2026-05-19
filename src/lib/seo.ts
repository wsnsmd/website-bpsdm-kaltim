// src/lib/seo.ts
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "BPSDM Provinsi Kalimantan Timur";

type SeoOptions = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  tags?: string[];
  noIndex?: boolean;
};

export function buildMetadata(opts: SeoOptions): Metadata {
  const {
    title,
    description,
    path = "",
    image = "/og-default.png",
    type = "website",
    publishedAt,
    updatedAt,
    tags = [],
    noIndex = false,
  } = opts;

  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    keywords: tags.length > 0 ? tags : undefined,

    alternates: { canonical: url },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },

    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: "id_ID",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedAt
        ? {
            publishedTime: publishedAt.toISOString(),
            modifiedTime: (updatedAt ?? publishedAt).toISOString(),
            tags,
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
