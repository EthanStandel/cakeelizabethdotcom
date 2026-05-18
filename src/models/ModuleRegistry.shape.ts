import { HeroModuleShape, HeroModuleType } from "./modules/HeroModule.shape";

export const ModuleRegistryShape = {
  hero: HeroModuleShape,
};

// TODO - tie this type down to the actual object above
export type ModuleRegistryType = {
  hero: HeroModuleType;
};
