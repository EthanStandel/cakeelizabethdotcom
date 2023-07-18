import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";
import { ImageListField } from "../fields/ImageListField";

export const AboutUsPageCollection: Collection = {
  label: "About us page",
  name: "AboutUsPageCollection",
  path: "content/AboutUsPageCollection",
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
    ImageListField({ label: "Owner photos", name: "ownerPhotos" }),
    {
      type: "rich-text",
      label: "About the founder text",
      name: "aboutTheFounderBody",
    },
    ImageListField({ label: "Founder photos", name: "founderPhotos" }),
  ],
};
