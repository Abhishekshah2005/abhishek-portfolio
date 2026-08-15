import type { NextConfig } from "next";

// Only applied for the GitHub Pages build (the deploy workflow sets this
// env var) — localhost and any other build target still serve from the
// root, so `pnpm dev`/`pnpm build` used for local verification throughout
// this project stay unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/abhishek-portfolio" : "";

const nextConfig: NextConfig = {
  // Every route in this app is already static (confirmed by every build
  // this session showing "○ Static" for all of them, including the
  // sitemap/robots/opengraph-image special files) — GitHub Pages can only
  // serve static files anyway, so `next build` emits a full ./out export.
  output: "export",
  basePath,
};

export default nextConfig;
