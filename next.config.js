/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "",
      "movmonkey.stringify.tech",
      "testit.movmonkey.com",
      "127.0.0.1", // Add your local domain
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'testit.movmonkey.com',
      },
      {
        protocol: 'https',
        hostname: 'testit.movmonkey.com',
      },
    ],
    // Add these settings for better Vercel compatibility
    unoptimized: false, // Keep optimization enabled
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
