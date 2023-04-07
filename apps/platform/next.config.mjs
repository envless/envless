/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
//!process.env.SKIP_ENV_VALIDATION && (await import("./env/index.mjs"));

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  transpilePackages: ["ui"],
  images: {
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    domains: [
      "avatar.vercel.sh",
      "avatars.githubusercontent.com",
      "user-images.githubusercontent.com",
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: true,
      }
    ]
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.wasm$/,
      loader: "base64-loader",
      type: "javascript/auto",
    });

    config.module.noParse = /\.wasm$/;

    config.module.rules.forEach((rule) => {
      (rule.oneOf || []).forEach((oneOf) => {
        if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
          oneOf.exclude.push(/\.wasm$/);
        }
      });
    });

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    // Perform customizations to webpack config
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /\/__tests__\// }),
    );

    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
