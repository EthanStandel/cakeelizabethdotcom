import z from "zod";
import { fields } from "~/lib/cms/define";
import { LinkShape } from "../components/Link.shape";

export const HeroModuleShape = {
  label: "Hero",
  fields: {
    eyebrow: fields.string({ label: "Eyebrow" }),
    content: fields.markdown({ label: "Content" }),
    ctaList: fields.list({
      label: "Link button",
      types: { link: LinkShape },
      required: false,
    }),
    backgroundImage: fields.image({
      label: "Background image",
      required: false,
    }),
  },
};

const HeroModuleShapeObject = fields.object(HeroModuleShape);

export type HeroModuleType = z.infer<typeof HeroModuleShapeObject._zodSchema>;
