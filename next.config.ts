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
    ],
  },
};

export default nextConfig;
