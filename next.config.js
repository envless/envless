/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatar.vercel.sh", "avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
