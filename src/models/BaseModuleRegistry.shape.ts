import z from "zod";
import { fields } from "~/lib/cms/define";
import { HeroModuleShape } from "./modules/HeroModule.shape";
import { FlavorMenuModuleShape } from "./modules/FlavorMenuModule.shape";
import { GeneralModuleShape } from "./modules/GeneralModule.shape";
import type { GroupFields } from "~/lib/cms/types";

export const baseModuleFieldGroups = {
  hero: HeroModuleShape,
  flavorMenu: FlavorMenuModuleShape,
  general: GeneralModuleShape,
};

type Groups = typeof baseModuleFieldGroups;

export const BaseModuleRegistryShape = Object.fromEntries(
  Object.entries(baseModuleFieldGroups).map(([key, { label, fields: f }]) => [
    key,
    fields.object({ label, fields: f }),
  ])
) as {
  [K in keyof Groups]: ReturnType<typeof fields.object<GroupFields<Groups[K]>>>;
};

export type BaseModuleRegistryType = {
  [K in keyof typeof BaseModuleRegistryShape]: z.infer<
    (typeof BaseModuleRegistryShape)[K]["_zodSchema"]
  >;
};
