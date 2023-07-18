// eslint-disable-next-line no-undef
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["assets.tina.io"],
  },
  rewrites: () => [
    {
      source: "/",
      destination: "/home",
    },
    {
      source: "/admin",
      destination: "/admin/index.html",
    },
    {
      source: "/preview",
      destination: "/admin#~",
    },
    {
      source: "/cake-flavors",
      destination: "/flavors",
    },
    {
      source: "/cake-pricing",
      destination: "/policies-and-pricing",
    },
    {
      source: "/order-policies",
      destination: "/policies-and-pricing",
    },
  ],
};
