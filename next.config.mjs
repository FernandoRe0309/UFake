/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.200.209.124'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
