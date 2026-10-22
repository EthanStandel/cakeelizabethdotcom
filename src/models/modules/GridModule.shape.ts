import z from "zod";
import { fields } from "~/lib/cms/define";
import { baseModuleFieldGroups } from "../BaseModuleRegistry.shape";
import type { GroupFields } from "~/lib/cms/types";

const antecedentField = fields.number({
  label: "Grid ratio antecedent",
  valueType: "int",
  required: false,
});

type Groups = typeof baseModuleFieldGroups;

const gridItemTypes = Object.fromEntries(
  Object.entries(baseModuleFieldGroups).map(([key, { label, fields: f }]) => [
    key,
    fields.object({ label, fields: { antecedent: antecedentField, ...f } }),
  ])
) as {
  [K in keyof Groups]: ReturnType<
    typeof fields.object<
      { antecedent: typeof antecedentField } & GroupFields<Groups[K]>
    >
  >;
};

export const GridModuleShape = fields.object({
  label: "Grid",
  fields: {
    items: fields.list({
      label: "Items",
      types: gridItemTypes,
      min: 2,
      max: 2,
    }),
  },
});

export type GridModuleType = z.infer<typeof GridModuleShape._zodSchema>;
