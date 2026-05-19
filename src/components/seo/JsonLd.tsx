// src/components/seo/JsonLd.tsx

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "BPSDM Provinsi Kalimantan Timur";

// ── Organization Schema ────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ["BPSDM Kaltim", "BPSDM Kalimantan Timur"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 200,
      height: 200,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. H.A.M.M. Rifaddin No. 88",
      addressLocality: "Samarinda",
      addressRegion: "Kalimantan Timur",
      postalCode: "75243",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-541-7270201",
      contactType: "customer service",
      areaServed: "ID",
      availableLanguage: "Indonesian",
    },
    sameAs: [
      "https://www.facebook.com/bpsdmkaltim",
      "https://www.instagram.com/bpsdmkaltim",
      "https://www.youtube.com/@bpsdmkaltim",
    ],
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Provinsi Kalimantan Timur",
      url: "https://kaltimprov.go.id",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── WebSite Schema (sitelinks searchbox) ──────
export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/berita?cari={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── BreadcrumbList Schema ──────────────────────
type BreadcrumbItem = { name: string; href: string };

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Article Schema (untuk halaman berita) ─────
type ArticleJsonLdProps = {
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorName?: string;
};

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
  authorName,
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    image: image ? `${SITE_URL}${image}` : `${SITE_URL}/og-default.png`,
    datePublished: publishedAt?.toISOString(),
    dateModified: (updatedAt ?? publishedAt)?.toISOString(),
    author: {
      "@type": "Organization",
      name: authorName ?? SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    isAccessibleForFree: true,
    inLanguage: "id-ID",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── EducationalEvent Schema (untuk jadwal diklat) ──
type EventJsonLdProps = {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  url?: string;
};

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
}: EventJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name,
    description,
    startDate,
    endDate,
    url: url ? `${SITE_URL}${url}` : SITE_URL,
    location: location
      ? {
          "@type": "Place",
          name: location,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Samarinda",
            addressRegion: "Kalimantan Timur",
            addressCountry: "ID",
          },
        }
      : undefined,
    organizer: {
      "@type": "GovernmentOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "id-ID",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
