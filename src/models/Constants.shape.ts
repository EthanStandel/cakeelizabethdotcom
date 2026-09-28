import { defineCollection, fields } from "~/lib/cms/define";
import z from "zod";

export const ConstantsShape = defineCollection({
  name: "constants",
  label: "Constants",
  folder: "public/content/constants",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    siteName: fields.string({ label: "Site Name", default: "Cake Elizabeth" }),
    galleryClose: fields.string({
      label: "Gallery: Close Label",
      default: "Close",
    }),
    galleryPrevious: fields.string({
      label: "Gallery: Previous Image Label",
      default: "Previous image",
    }),
    galleryNext: fields.string({
      label: "Gallery: Next Image Label",
      default: "Next image",
    }),
    notFoundTitle: fields.string({
      label: "Not Found: Page Title",
      default: "Not Found",
    }),
    notFoundHeading: fields.string({
      label: "Not Found: Heading",
      default: "Page Not Found",
    }),
    inquireLabel: fields.string({
      label: "Inquire Button: Label",
      default: "Inquire",
    }),
  },
});

export type ConstantsType = z.infer<typeof ConstantsShape.schema>;
