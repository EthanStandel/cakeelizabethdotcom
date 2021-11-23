/** @type {import('next').NextConfig} */
const { withContentlayer } = require("next-contentlayer");

module.exports = withContentlayer()({
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
    },
    {
      source: "/delivery-and-order-policies",
      destination: "/order-policies",
      permanent: true,
    }
  ]),
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "raw-loader",
    });

    return config;
  },
});
