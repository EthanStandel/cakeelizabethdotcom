import { Collection } from "tinacms";

export const aboutThisWebsite: Collection = {
  label: "About this website",
  name: "aboutThisWebsite",
  path: "content/about-this-website",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "string",
      label: "Title",
      name: "title",
      required: true,
    },
    {
      type: "rich-text",
      label: "Body",
      name: "body",
      isBody: true,
    },
  ],
};
