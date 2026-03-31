/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@transmit/validations"],
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
