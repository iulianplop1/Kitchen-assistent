/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // For GitHub Pages: basePath will be set automatically by GitHub Actions
  // For local dev: leave empty (no basePath)
  basePath: process.env.GITHUB_REPO_NAME ? `/${process.env.GITHUB_REPO_NAME}` : '',
  assetPrefix: process.env.GITHUB_REPO_NAME ? `/${process.env.GITHUB_REPO_NAME}` : '',
};

module.exports = nextConfig;
