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

module.exports = nextConfig;
