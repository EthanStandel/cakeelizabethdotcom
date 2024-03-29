import { Collection } from "tinacms";

export const GlobalCollection: Collection = {
  label: "Global",
  name: "GlobalCollection",
  path: "content/GlobalCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => "/",
  },
  fields: [
    {
      type: "object",
      label: "Header",
      name: "header",
      fields: [
        {
          type: "string",
          label: "Phone number",
          name: "phoneNumber",
          required: true,
        },
        {
          type: "object",
          label: "Social Links",
          name: "socialLinks",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item.label }),
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
              required: true,
            },
            {
              type: "string",
              label: "URL",
              name: "url",
              required: true,
            },
          ],
        },
        {
          type: "image",
          label: "Logo",
          name: "logo",
          required: true,
        },
        {
          type: "object",
          label: "Navigation",
          name: "navigation",
          list: true,
          ui: {
            itemProps: (item) => ({ label: item.label }),
          },
          fields: [
            {
              type: "string",
              label: "Label",
              name: "label",
              required: true,
            },
            {
              type: "string",
              label: "URL",
              name: "url",
            },
            {
              type: "object",
              label: "Sub Navigation",
              name: "subNavItem",
              list: true,
              ui: {
                itemProps: (item) => ({ label: item.label }),
              },
              fields: [
                {
                  type: "string",
                  label: "Label",
                  name: "label",
                  required: true,
                  isTitle: true,
                },
                {
                  type: "string",
                  label: "URL",
                  name: "url",
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "object",
      label: "Footer",
      name: "footer",
      fields: [
        {
          type: "string",
          label: "Label",
          name: "label",
          required: true,
        },
      ],
    },
  ],
};
