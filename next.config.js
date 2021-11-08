/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    prependData: '@use "src/styles/global" as *',
  },
  redirects: (async () => [
    {
      source: "/schedule-your-tasting",
      destination: "/contact",
      permanent: true,
    },
    {
      source: "/cake-pricing-flavors",
      destination: "/cake-flavors",
      permanent: true
    }
  ]),
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "raw-loader",
    });

    return config;
  },
};
