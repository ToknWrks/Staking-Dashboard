/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      // Add other Node.js native modules if needed
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    return config;
  },
};

module.exports = nextConfig;