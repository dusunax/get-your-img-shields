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
    "playwright-core",
    "@sparticuz/chromium-min",
    "puppeteer-core",
  ],
};

export default nextConfig;
