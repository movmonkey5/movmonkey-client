/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true, // This disables Next.js image optimization completely
    remotePatterns: [
      {
        protocol: "http",
        hostname: "testit.movmonkey.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "testit.movmonkey.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optional: Add domains for fallback (legacy support)
    domains: ["testit.movmonkey.com"],
  },
};

module.exports = nextConfig;
