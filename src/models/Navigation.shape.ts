import { defineCollection, fields } from "~/lib/cms/define";
import { LinkShape } from "./components/Link.shape";
import z from "zod";

export const NavigationShape = defineCollection({
  name: "navigation",
  label: "Navigation",
  folder: "public/content/navigation",
  create: false,
  identifierField: "name",
  previewPath: null,
  fields: {
    name: fields.string({ label: "Name" }),
    links: fields.list({
      label: "Links",
      types: { link: LinkShape },
    }),
    menuOpen: fields.string({
      label: "Menu: Open Label",
      default: "Open navigation",
    }),
    menuClose: fields.string({
      label: "Menu: Close Label",
      default: "Close navigation",
    }),
  },
});

export type NavigationType = z.infer<typeof NavigationShape.schema>;
