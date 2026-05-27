import { Component } from "solid-js";
import { ModuleRegistryType } from "~/models/ModuleRegistry.shape";
import { HeroModule } from "./HeroModule";
import { GridModule } from "./GridModule";
import { FlavorMenuModule } from "./FlavorMenuModule";
import { GeneralModule } from "./GeneralModule";
import { Dynamic } from "solid-js/web";

// TODO - make this more strict so that prop types properly align
export const moduleRegistry = {
  hero: HeroModule,
  grid: GridModule,
  flavorMenu: FlavorMenuModule,
  general: GeneralModule,
} satisfies Record<keyof ModuleRegistryType, Component<{ shape: any }>>;

export const ModuleRegistry: Component<{
  module: keyof typeof moduleRegistry;
  shape: any;
}> = (props) => (
  <Dynamic component={moduleRegistry[props.module]} shape={props.shape} />
);
