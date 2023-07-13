import { defineConfig } from "tinacms";
import { aboutUsPage } from "./models/AboutUsPage";
import { flavorPageModel } from "./models/FlavorPage";
import { globalModel } from "./models/Global";
import { homePageModel } from "./models/HomePage";
import { policiesAndPricingPageModel } from "./models/PoliciesAndPricingPage";
import { productModel } from "./models/Product";
import { aboutThisWebsite } from "./models/AboutThisWebsite";
import { contactUsPage } from "./models/ContactUsPage";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    "feat/tina-rewrite", // initial default value
  token: process.env.TINA_TOKEN!,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  cmsCallback: (cms) => {
    cms.flags.set("branch-switcher", true);
    return cms;
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [
      globalModel,
      homePageModel,
      flavorPageModel,
      productModel,
      policiesAndPricingPageModel,
      aboutUsPage,
      aboutThisWebsite,
      contactUsPage,
    ],
  },
});

export default config;
