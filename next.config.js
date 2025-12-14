/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  compress: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: process.env.NEXT_PUBLIC_SERVER_PROTOCOL || "https",
        hostname: process.env.NEXT_PUBLIC_SERVER_URL || "api.eranico.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "api.eranico.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.eranico.ir", pathname: "/**" },
      { protocol: "https", hostname: "eranico.armandar.com", pathname: "/**" },
      { protocol: "https", hostname: "www.eranico.com", pathname: "/**" },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    missingSuspenseWithCSRBailout: false,
  },

  sassOptions: {
    includePaths: [path.join(__dirname, "src/css")],
  },

  async redirects() {
    return [
      {
        source: "/content",
        destination: "/news",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
