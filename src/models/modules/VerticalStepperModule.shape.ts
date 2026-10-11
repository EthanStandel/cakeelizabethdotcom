import z from "zod";
import { fields } from "~/lib/cms/define";

export const VerticalStepperModuleShape = {
  label: "Vertical Stepper",
  fields: {
    heading: fields.string({ label: "Heading", required: false }),
    steps: fields.list({
      label: "Steps",
      fields: {
        title: fields.string({ label: "Title" }),
        description: fields.text({ label: "Description" }),
      },
    }),
  },
};

const VerticalStepperModuleShapeObject = fields.object(
  VerticalStepperModuleShape,
);

export type VerticalStepperModuleType = z.infer<
  typeof VerticalStepperModuleShapeObject._zodSchema
>;
