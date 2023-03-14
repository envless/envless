/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./env/index.mjs"));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "avatar.vercel.sh",
      "avatars.githubusercontent.com",
      "user-images.githubusercontent.com",
    ],
  },
};

export default nextConfig;
