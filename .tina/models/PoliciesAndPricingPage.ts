import { Collection } from "tinacms";

export const policiesAndPricingPageModel: Collection = {
  label: "Policies & Pricing page",
  name: "policiesAndPricingPage",
  path: "content/policies-and-pricing",
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
      type: "image",
      label: "Hero image",
      name: "heroImage",
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
