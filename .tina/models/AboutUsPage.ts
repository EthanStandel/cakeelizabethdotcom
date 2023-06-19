import { Collection } from "tinacms";
import { imageList } from "./imageList";

export const aboutUsPage: Collection = {
  label: "About us page",
  name: "aboutUsPage",
  path: "content/about-us",
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
      label: "New ownership text",
      name: "newOwnershipBody",
    },
    imageList({ label: "Owner photos", name: "ownerPhotos" }),
    {
      type: "rich-text",
      label: "About the founder text",
      name: "aboutTheFounderBody",
    },
    imageList({ label: "Founder photos", name: "founderPhotos" }),
  ],
};
