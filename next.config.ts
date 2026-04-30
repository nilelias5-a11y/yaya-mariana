import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
