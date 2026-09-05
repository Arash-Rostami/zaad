/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "ai.google.dev" },
    ],
  },
  async redirects() {
    return [
      { source: "/brand-value", destination: "/story", permanent: true },
      { source: "/csr", destination: "/sustainability", permanent: true },
    ];
  },
};

export default nextConfig;
