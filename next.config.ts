import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yayamariana.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
