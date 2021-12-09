//@ts-check
const fs = require("fs");
const _ = require("lodash");

module.exports = {
  siteUrl: 'https://cakeelizabeth.com',
  generateRobotsTxt: true,
  additionalPaths: () => {
    const allPagesContent = fs.readdirSync("./public/resources/pages")
      // remove hidden files/directories
      .filter(file => !file.startsWith("."));
    const allPagesDirectory = fs.readdirSync("./src/pages")
      .map(file => file.split(".")[0]);
    return _.difference(allPagesContent, allPagesDirectory).map((file) => ({
      loc: `/${file}`,
      changefreq: "daily",
      priority: .7,
      lastmod: new Date().toISOString()
    }))

  }
};