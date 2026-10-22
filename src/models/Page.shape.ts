import { defineCollection, fields } from "~/lib/cms/define";
import { PAGE_COLLECTION_NAME, getPagePath } from "~/lib/pagePaths";
import { ModuleRegistryShape } from "./ModuleRegistry.shape";
import z from "zod";

export { HOME_PAGE_SLUG, HOME_PAGE_PATH, getPagePath } from "~/lib/pagePaths";
export const SEARCH_TITLE_MAX_LENGTH = 43;
export const DESCRIPTION_MAX_LENGTH = 160;

export const PageShape = defineCollection({
  name: PAGE_COLLECTION_NAME,
  label: "Page",
  folder: "public/content",
  create: true,
  identifierField: "title",
  previewPath: getPagePath,
  fields: {
    title: fields.string({ label: "Title" }),
    modules: fields.list({
      label: "Modules",
      types: ModuleRegistryShape,
      required: false,
    }),
    seo: fields.object({
      label: "SEO",
      required: false,
      fields: {
        title: fields.string({
          label: "Search Title",
          required: false,
          maxLength: SEARCH_TITLE_MAX_LENGTH,
        }),
        description: fields.text({
          label: "Description",
          required: false,
          maxLength: DESCRIPTION_MAX_LENGTH,
        }),
        image: fields.image({ label: "Share Image", required: false }),
        imageAlt: fields.string({
          label: "Share Image: Alt Text",
          required: false,
        }),
        noindex: fields.boolean({
          label: "Hide From Search Engines",
          required: false,
          default: false,
        }),
      },
    }),
  },
});

export type PageType = z.infer<typeof PageShape.schema>;
