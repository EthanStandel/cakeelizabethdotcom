/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    prependData: '@use "src/styles/global" as *',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "raw-loader",
    });

    return config;
  },
};
