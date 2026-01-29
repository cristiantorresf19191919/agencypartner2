/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'epicwebsol.com',
      },
      {
        protocol: 'https',
        hostname: 'kotlinlang.org',
      },
    ],
  },
}

module.exports = nextConfig

