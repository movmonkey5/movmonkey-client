/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "stagingmovmonkeyv1.pythonanywhere.com",
      "movmonkey.stringify.tech",
      "backend.movmonkey.com",
      "127.0.0.1", // Add your local domain
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;
