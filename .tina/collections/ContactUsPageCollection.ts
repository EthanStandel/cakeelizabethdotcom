import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";

export const ContactUsPageCollection: Collection = {
  label: "Contact Us Page",
  name: "ContactUsPageCollection",
  path: "content/ContactUsPageCollection",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => "/contact",
  },
  fields: [
    MetadataField,
    {
      type: "rich-text",
      label: "Contact details",
      name: "contactDetails",
      isBody: true,
    },
  ],
};
