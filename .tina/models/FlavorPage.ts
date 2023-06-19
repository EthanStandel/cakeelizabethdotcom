import { Collection } from "tinacms";

export const flavorPageModel: Collection = {
  label: "Flavor page",
  name: "flavorPage",
  path: "content/flavor-page",
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
    {
      type: "image",
      label: "Hero image",
      name: "heroImage",
      required: true,
    },
    {
      type: "object",
      label: "Flavor groups",
      name: "flavorGroups",
      ui: {
        itemProps: (item) => ({ label: item.label }),
      },
      list: true,
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true,
        },
        {
          type: "string",
          label: "Flavors",
          name: "flavors",
          list: true,
          required: true,
        },
      ],
    },
  ],
};
