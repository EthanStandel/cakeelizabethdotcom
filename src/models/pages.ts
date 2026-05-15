import { defineCollection, fields } from "~/lib/cms/define";

export const pagesCollection = defineCollection({
  name: "pages",
  label: "Pages",
  folder: "public/content",
  create: true,
  identifierField: "title",
  fields: {
    title: fields.string({ label: "Title" }),
    content: fields.markdown({ label: "Content" }),
  },
});
