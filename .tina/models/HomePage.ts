import { Collection } from "tinacms";

export const homePageModel: Collection = {
  label: "Home page",
  name: "homePage",
  path: "content/homePage",
  format: "md",
  fields: [
    {
      type: "image",
      label: "Hero image",
      name: "heroImage",
    },
    {
      type: "string",
      label: "CTA",
      name: "cta",
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true,
    },
  ],
};
