import { defineCollection, fields } from "~/lib/cms/define";
import z from "zod";

export const TagsShape = defineCollection({
  name: "tags",
  label: "Tags",
  folder: "public/content/tags",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    tags: fields.list({ label: "Tags" }),
  },
});

export type TagsType = z.infer<typeof TagsShape.schema>;
