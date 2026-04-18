/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable typedRoutes to avoid TypeScript errors with dynamic hrefs.
  experimental: {
    typedRoutes: false
  }
};

module.exports = nextConfig;