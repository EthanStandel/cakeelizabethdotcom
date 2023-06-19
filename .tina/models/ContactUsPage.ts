import { Collection } from "tinacms";

export const contactUsPage: Collection = {
  label: "Contact Us Page",
  name: "contactUsPage",
  path: "content/contact-us",
  format: "md",
  ui: {
    allowedActions: {
      create: false,
      delete: false,
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Contact details",
      name: "contactDetails",
      isBody: true,
    },
  ],
};
