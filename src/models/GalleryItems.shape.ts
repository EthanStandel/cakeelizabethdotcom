import { defineCollection, fields } from "~/lib/cms/define";
import z from "zod";

export const GalleryItemsShape = defineCollection({
  name: "gallery-items",
  label: "Gallery Items",
  folder: "public/content/gallery-items",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    items: fields.list({
      label: "Items",
      fields: {
        image: fields.image({ label: "Image" }),
        title: fields.string({ label: "Title" }),
        description: fields.text({ label: "Description" }),
        tags: fields.multiSelect({
          label: "Tags",
          refOptions: { collection: "tags", field: "tags" },
        }),
      },
    }),
  },
});

export type GalleryItemsType = z.infer<typeof GalleryItemsShape.schema>;
