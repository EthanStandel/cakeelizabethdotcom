import z from "zod";
import { fields } from "~/lib/cms/define";
import { LinkShape } from "../components/Link.shape";

export const FlavorCombinationsModuleShape = {
  label: "Flavor Combinations",
  fields: {
    heading: fields.string({ label: "Heading", required: false }),
    cakeLabel: fields.string({ label: "Cake row label" }),
    fillingLabel: fields.string({ label: "Filling row label" }),
    frostingLabel: fields.string({ label: "Frosting row label" }),
    combinations: fields.list({
      label: "Combinations",
      fields: {
        name: fields.string({ label: "Name" }),
        cake: fields.string({ label: "Cake", required: false }),
        filling: fields.string({ label: "Filling", required: false }),
        frosting: fields.string({ label: "Frosting", required: false }),
      },
    }),
    ctaList: fields.list({
      label: "CTAs",
      types: { link: LinkShape },
      required: false,
    }),
  },
};

const FlavorCombinationsModuleShapeObject = fields.object(
  FlavorCombinationsModuleShape,
);

export type FlavorCombinationsModuleType = z.infer<
  typeof FlavorCombinationsModuleShapeObject._zodSchema
>;
