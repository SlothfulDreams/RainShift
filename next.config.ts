import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shared.fastly.steamstatic.com",
        pathname: "/community_assets/images/apps/632360/**",
      },
    ],
  },
};

export default nextConfig;
