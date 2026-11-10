import { defineCollection, fields } from "~/lib/cms/define";
import z from "zod";
import { DESCRIPTION_MAX_LENGTH } from "./Page.shape";

export const SeoShape = defineCollection({
  name: "seo",
  label: "SEO",
  folder: "public/content/seo",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    titleTemplate: fields.string({
      label: "Title Template",
      default: "{title} | Cake Elizabeth",
    }),
    defaultDescription: fields.text({
      label: "Default Description",
      required: false,
      maxLength: DESCRIPTION_MAX_LENGTH,
    }),
    defaultImage: fields.image({
      label: "Default Share Image",
      required: false,
    }),
    defaultImageAlt: fields.string({
      label: "Default Share Image: Alt Text",
      required: false,
    }),
    areaServed: fields.string({ label: "Area Served", required: false }),
    profiles: fields.list({ label: "Profile Addresses", required: false }),
    address: fields.object({
      label: "Address",
      required: false,
      fields: {
        streetAddress: fields.string({ label: "Street", required: false }),
        addressLocality: fields.string({ label: "City", required: false }),
        addressRegion: fields.string({ label: "State", required: false }),
        postalCode: fields.string({ label: "ZIP Code", required: false }),
        addressCountry: fields.string({
          label: "Country",
          required: false,
          default: "US",
        }),
      },
    }),
  },
});

export type SeoType = z.infer<typeof SeoShape.schema>;
