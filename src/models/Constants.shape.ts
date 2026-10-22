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
    logo: fields.image({ label: "Logo" }),
    phone: fields.string({ label: "Phone" }),
    email: fields.string({ label: "Email" }),
    copyright: fields.string({ label: "Copyright" }),
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
    inquireLabel: fields.string({
      label: "Inquire Button: Label",
      default: "Inquire",
    }),
  },
});

export type ConstantsType = z.infer<typeof ConstantsShape.schema>;
