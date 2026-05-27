import z from "zod";
import { fields } from "~/lib/cms/define";
import { LinkShape } from "../components/Link.shape";

export const GeneralModuleShape = {
  label: "General",
  fields: {
    submodules: fields.list({
      label: "Submodules",
      fields: {
        title: fields.string({ label: "Title" }),
        heroImage: fields.image({ label: "Hero image", required: false }),
        body: fields.markdown({ label: "Body", required: false }),
        ctaList: fields.list({
          label: "CTAs",
          types: { link: LinkShape },
          required: false,
        }),
      },
    }),
  },
};

const GeneralModuleShapeObject = fields.object(GeneralModuleShape);

export type GeneralModuleType = z.infer<
  typeof GeneralModuleShapeObject._zodSchema
>;
