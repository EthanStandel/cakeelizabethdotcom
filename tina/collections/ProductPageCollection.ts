import { Collection } from "tinacms";
import { MetadataField } from "../fields/MetadataField";
import { ImageListField } from "../fields/ImageListField";

export const ProductPageCollection: Collection = {
  label: "Products",
  name: "ProductPageCollection",
  path: "content/ProductPageCollection",
  format: "md",
  ui: {
    router: ({ document }) => `/products/${document._sys.filename.slice(0)}`,
  },
  fields: [
    MetadataField,
    {
      type: "boolean",
      label: "Hidden",
      name: "hidden",
    },
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
    ImageListField(),
  ],
};
