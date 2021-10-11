/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  sassOptions: {
    prependData: '@use "src/styles/global" as *;',
  },
};
