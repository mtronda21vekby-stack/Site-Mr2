/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for catch common issues
  reactStrictMode: true,
  // Explicitly disable typed routes to avoid compile errors when constructing
  // route strings dynamically. You can enable this and fix typings later.
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;