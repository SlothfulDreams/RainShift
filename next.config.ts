import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fastly.steamstatic.com",
        pathname: "/steamcommunity/public/images/**",
      },
      {
        protocol: "https",
        hostname: "riskofrain2.wiki.gg",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
