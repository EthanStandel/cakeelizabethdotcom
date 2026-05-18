import z from "zod";
import { fields } from "~/lib/cms/define";

export const LinkShape = fields.object({
  label: "Link",
  fields: {
    label: fields.string({ label: "Label" }),
    url: fields.string({ label: "URL" }),
    variant: fields.select({
      label: "Variant",
      options: ["primary", "secondary"],
      default: "primary",
    }),
  },
});

export type LinkType = z.infer<typeof LinkShape._zodSchema>;
