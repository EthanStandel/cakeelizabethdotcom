import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";

export const PoliciesAndPricingPageCollection: Collection = {
  label: "Policies & Pricing page",
  name: "PoliciesAndPricingPageCollection",
  path: "content/PoliciesAndPricingPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => "/policies-and-pricing",
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
