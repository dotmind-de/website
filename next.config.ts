import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the netcup VPS (see HOSTING.md).
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
