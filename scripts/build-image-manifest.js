const fs = require("fs");

const pagesDir = "./public/resources/pages/";

const pages = fs.readdirSync(pagesDir).filter(name => !name.startsWith("."));

pages.forEach(page => {
  const images = fs.readdirSync(pagesDir + page)
    .filter(file => [".gif", ".png", ".jpg", ".jpeg", ".svg"].some(suffix => file.endsWith(suffix)))
    .map(image => `/resources/pages/${page}/${image}`);
  const manifestExists = fs.existsSync(pagesDir + page + "/imageManifest.json");
  if (manifestExists) {
    fs.unlinkSync(pagesDir + page + "/imageManifest.json");
  }
  fs.writeFileSync(pagesDir + page + "/imageManifest.json", JSON.stringify({items: images}));
});