import z from "zod";
import { fields } from "~/lib/cms/define";
import { LinkShape } from "../components/Link.shape";

export const HeroModuleShape = {
  label: "Hero",
  fields: {
    eyebrow: fields.string({ label: "Eyebrow", required: false }),
    content: fields.markdown({ label: "Content" }),
    alignment: fields.select({
      label: "Alignment",
      options: ["left", "center"],
      default: "left",
      required: false,
    }),
    ruleAbove: fields.boolean({
      label: "Rule above",
      default: false,
      required: false,
    }),
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
