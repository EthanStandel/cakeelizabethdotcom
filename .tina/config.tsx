import { defineConfig } from "tinacms";
import { AboutUsPageCollection } from "./collections/AboutUsPageCollection";
import { FlavorPageCollection } from "./collections/FlavorPageCollection";
import { GlobalCollection } from "./collections/GlobalCollection";
import { HomePageCollection } from "./collections/HomePageCollection";
import { PoliciesAndPricingPageCollection } from "./collections/PoliciesAndPricingPageCollection";
import { ProductPageCollection } from "./collections/ProductPageCollection";
import { AboutThisWebsitePageCollection } from "./collections/AboutThisWebsitePageCollection";
import { ContactUsPageCollection } from "./collections/ContactUsPageCollection";

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
      GlobalCollection,
      HomePageCollection,
      FlavorPageCollection,
      ProductPageCollection,
      PoliciesAndPricingPageCollection,
      AboutUsPageCollection,
      AboutThisWebsitePageCollection,
      ContactUsPageCollection,
    ],
  },
});

export default config;
