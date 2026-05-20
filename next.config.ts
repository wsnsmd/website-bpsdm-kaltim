// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2"],
  // Optimasi package imports
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },

  // Konfigurasi gambar
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.bpsdm.kaltimprov.go.id",
        pathname: "/bpsdm-media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/uploads/:path*",
      },
    ];
  },

  // Headers keamanan
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Redirect legacy
  async redirects() {
    return [
      {
        source: "/category/:slug",
        destination: "/berita?kategori=:slug",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/profil",
        permanent: true,
      },
    ];
  },

  // Output standalone untuk deployment
  output: "standalone",
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
