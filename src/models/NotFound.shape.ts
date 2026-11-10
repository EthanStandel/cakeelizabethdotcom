import { defineCollection, fields } from "~/lib/cms/define";
import { LinkShape } from "./components/Link.shape";
import z from "zod";

export const NOT_FOUND_PAGE_SLUG = "404";
export const NOT_FOUND_PATH = `/${NOT_FOUND_PAGE_SLUG}`;

export const NotFoundShape = defineCollection({
  name: "not-found",
  label: "Not Found",
  folder: "public/content/not-found",
  create: false,
  identifierField: "name",
  previewPath: () => NOT_FOUND_PATH,
  fields: {
    name: fields.string({ label: "Name" }),
    title: fields.string({ label: "Page Title", default: "Page not found" }),
    eyebrow: fields.string({ label: "Eyebrow", default: "Page not found" }),
    code: fields.string({ label: "Code", default: "404" }),
    heading: fields.string({ label: "Heading", default: "Cake not found." }),
    ctaList: fields.list({
      label: "Link button",
      types: { link: LinkShape },
      required: false,
    }),
  },
});

export type NotFoundType = z.infer<typeof NotFoundShape.schema>;
