import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Thumbnails of news republished from canhsatpccc.gov.vn (Cục Cảnh sát PCCC và CNCH).
    remotePatterns: [{ protocol: "https", hostname: "cdn.canhsatpccc.gov.vn", pathname: "/Uploads/**" }],
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
