import { GridModuleShape, GridModuleType } from "./modules/GridModule.shape";
import {
  BaseModuleRegistryShape,
  BaseModuleRegistryType,
} from "./BaseModuleRegistry.shape";

export { BaseModuleRegistryShape };
export type { BaseModuleRegistryType };

export const ModuleRegistryShape = {
  ...BaseModuleRegistryShape,
  grid: GridModuleShape,
};

export type ModuleRegistryType = BaseModuleRegistryType & {
  grid: GridModuleType;
};
