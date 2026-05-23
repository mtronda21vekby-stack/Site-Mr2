import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/ru',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/ru/:path*',
        destination: '/en/:path*',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ]
  },
}

export default nextConfig