/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  runtime: "experimental-edge",
  api: {
    bodyParser: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ["avatar.vercel.sh"],
    remotePatterns: [
      {
        protocol: "https:",
        hostname: "avatar.vercel.sh",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
