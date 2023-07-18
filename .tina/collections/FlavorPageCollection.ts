import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";

export const FlavorPageCollection: Collection = {
  label: "Flavor page",
  name: "FlavorPageCollection",
  path: "content/FlavorPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => "/flavors",
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
