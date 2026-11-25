import type { NextConfig } from "next";

/** GitHub Pages project site: https://<user>.github.io/ai-creative-workshop/ */
const basePath = "/ai-creative-workshop";

const nextConfig: NextConfig = {
  // a static site in out/: no server, one index.html; slides are addressed by hash (#05), so deep links and refresh work
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
