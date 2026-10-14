import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
