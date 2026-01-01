// eslint-disable-next-line no-undef
module.exports = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  images: {
    remotePatterns: [{ hostname: "assets.tina.io" }],
  },
  rewrites: () => [
    {
      source: "/admin",
      destination: "/admin/index.html",
    },
  ],
  redirects: () => [
    {
      source: "/preview",
      destination: "/admin#/~/",
      permanent: false,
    },
    {
      source: "/cake-pricing",
      destination: "/policies-and-pricing",
      permanent: true,
    },
    {
      source: "/order-policies",
      destination: "/policies-and-pricing",
      permanent: true,
    },
    {
      source: "/cake-flavors",
      destination: "/flavors",
      permanent: true,
    },
    {
      source: "/weddings",
      destination: "/product/weddings",
      permanent: false,
    },
    {
      source: "/childrens-cake",
      destination: "/product/childrens-cake",
      permanent: true,
    },
    {
      source: "/birthday-cakes",
      destination: "/product/birthday-cakes",
      permanent: true,
    },
    {
      source: "/shower-cakes",
      destination: "/product/shower-cakes",
      permanent: true,
    },
    {
      source: "/special-occasion-cakes",
      destination: "/product/special-occasion-cakes",
      permanent: true,
    },
    {
      source: "/religious-cakes",
      destination: "/product/religious-cakes",
      permanent: true,
    },
    {
      source: "/holiday-cakes",
      destination: "/product/holiday-cakes",
      permanent: true,
    },
    {
      source: "/cupcakes",
      destination: "/product/cupcakes",
      permanent: true,
    },
    {
      source: "/cake-pops-cookies",
      destination: "/product/cake-pops-cookies",
      permanent: true,
    },
  ],
};
