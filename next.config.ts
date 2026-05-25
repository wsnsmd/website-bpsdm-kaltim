// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2", "nodemailer"],

  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "react-icons",
      "framer-motion",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.bpsdm.kaltimprov.go.id",
        pathname: "/bpsdm-media/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com", // thumbnail YouTube
      },
      {
        protocol: "https",
        hostname: "picsum.photos", // placeholder dev
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // cache gambar 1 hari
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: false,
  },

  async rewrites() {
    return [{ source: "/uploads/:path*", destination: "/uploads/:path*" }];
  },

  async headers() {
    return [
      // Security headers semua halaman
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      // Cache static assets agresif
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache API search (short TTL)
      {
        source: "/api/search",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, stale-while-revalidate=300",
          },
        ],
      },
      // No cache admin
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, no-cache" }],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/category/:slug",
        destination: "/berita?kategori=:slug",
        permanent: true,
      },
      { source: "/about", destination: "/profil", permanent: true },
    ];
  },

  // output: "standalone",
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
