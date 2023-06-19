import { Collection } from "tinacms";
import { imageList } from "./imageList";

export const productModel: Collection = {
  label: "Products",
  name: "product",
  path: "content/product",
  format: "md",
  fields: [
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
    imageList(),
  ],
};