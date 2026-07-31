import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  transpilePackages: ["react-pdf", "pdfjs-dist"],
  // Allow embedding inside Wix (and other) iframes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // pdfjs optional native dependency is not needed in the browser
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
