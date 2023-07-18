import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";

export const AboutThisWebsitePageCollection: Collection = {
  label: "About this website",
  name: "AboutThisWebsitePageCollection",
  path: "content/AboutThisWebsitePageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    MetadataField,
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
