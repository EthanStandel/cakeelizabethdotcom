import { defineCollection, fields } from "~/lib/cms/define";
import { ModuleRegistryShape } from "./ModuleRegistry.shape";
import z from "zod";

export const PageShape = defineCollection({
  name: "page",
  label: "Page",
  folder: "public/content",
  create: true,
  identifierField: "title",
  fields: {
    title: fields.string({ label: "Title" }),
    content: fields.markdown({ label: "Content" }),
    modules: fields.list({
      label: "Modules",
      types: ModuleRegistryShape,
      required: false,
    }),
  },
});

export type PageType = z.infer<typeof PageShape.schema>;
