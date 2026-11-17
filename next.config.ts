import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // News images (cdn.canhsatpccc.gov.vn) use unoptimized <Image>: the CDN only serves Vietnamese IPs, so the
  // visitor's browser loads them directly instead of the image optimizer abroad.
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
