import type { NextConfig } from "next";

// Prefixed languages; Vietnamese (the default) keeps the unprefixed URLs. Keep in sync with src/i18n/config.ts.
const prefixedLocales = "en|zh|ko|ja";

const nextConfig: NextConfig = {
  // News images (cdn.canhsatpccc.gov.vn) use unoptimized <Image>: the CDN only serves Vietnamese IPs, so the
  // visitor's browser loads them directly instead of the image optimizer abroad.
  experimental: {
    agentUpgrade: "security",
  },
  // Each page has one address per language: /vi/... is folded into the unprefixed Vietnamese URL.
  async redirects() {
    return [
      { source: "/vi", destination: "/", permanent: true },
      { source: "/vi/:path*", destination: "/:path*", permanent: true },
    ];
  },
  // Unprefixed URLs are served by app/[lang] as Vietnamese. These run after public files and metadata routes
  // (images, robots.txt, sitemap.xml…) and before dynamic routes, and always route internally.
  async rewrites() {
    return [
      { source: "/", destination: "/vi" },
      // First segment is anything except a locale code ("(?![^/])" = the segment ends there).
      { source: `/:first((?!(?:${prefixedLocales}|vi)(?![^/]))[^/]+)/:rest*`, destination: "/vi/:first/:rest*" },
    ];
  },
};

export default nextConfig;
