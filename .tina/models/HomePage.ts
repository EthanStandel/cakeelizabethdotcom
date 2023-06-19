import { Collection } from "tinacms";

export const homePageModel: Collection = {
  label: "Home page",
  name: "homePage",
  path: "content/homePage",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
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
