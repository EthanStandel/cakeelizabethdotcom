import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";

export const HomePageCollection: Collection = {
  label: "Home page",
  name: "HomePageCollection",
  path: "content/HomePageCollection",
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
    {
      type: "object",
      label: "Quotes",
      name: "quotes",
      list: true,
      ui: { itemProps: (item) => ({ label: item.name }) },
      fields: [
        {
          type: "string",
          label: "Quote",
          name: "quote",
          required: true,
        },
        {
          type: "string",
          label: "Name",
          name: "name",
          required: true,
        },
      ],
    },
  ],
};
