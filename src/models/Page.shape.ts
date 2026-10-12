import { defineCollection, fields } from "~/lib/cms/define";
import { ModuleRegistryShape } from "./ModuleRegistry.shape";
import z from "zod";

export const HOME_PAGE_SLUG = "home";
export const HOME_PAGE_PATH = "/";

export const PageShape = defineCollection({
  name: "page",
  label: "Page",
  folder: "public/content",
  create: true,
  identifierField: "title",
  previewPath: (slug) => (slug === HOME_PAGE_SLUG ? HOME_PAGE_PATH : `/${slug}`),
  fields: {
    title: fields.string({ label: "Title" }),
    modules: fields.list({
      label: "Modules",
      types: ModuleRegistryShape,
      required: false,
    }),
  },
});

export type PageType = z.infer<typeof PageShape.schema>;
