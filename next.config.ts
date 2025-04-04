import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
    ],
  },
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "@sparticuz/chromium",
  ],
};

export default nextConfig;
