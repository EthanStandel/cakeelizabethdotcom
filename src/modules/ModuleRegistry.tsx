import { Component } from "solid-js";
import { ModuleRegistryType } from "~/models/ModuleRegistry.shape";
import { HeroModule } from "./HeroModule";
import { GridModule } from "./GridModule";
import { FlavorMenuModule } from "./FlavorMenuModule";
import { GeneralModule } from "./GeneralModule";
import { GalleryModule } from "./GalleryModule";
import { HorizontalListModule } from "./HorizontalListModule";
import { VerticalStepperModule } from "./VerticalStepperModule";
import { ContactFormModule } from "./ContactFormModule";
import { FlavorCombinationsModule } from "./FlavorCombinationsModule";
import { Dynamic } from "solid-js/web";

export const moduleRegistry = {
  hero: HeroModule,
  grid: GridModule,
  flavorMenu: FlavorMenuModule,
  general: GeneralModule,
  gallery: GalleryModule,
  horizontalList: HorizontalListModule,
  verticalStepper: VerticalStepperModule,
  contactForm: ContactFormModule,
  flavorCombinations: FlavorCombinationsModule,
} satisfies {
  [K in keyof ModuleRegistryType]: Component<{ shape: ModuleRegistryType[K] }>;
};

export type ModuleEntry = {
  [K in keyof ModuleRegistryType]: ModuleRegistryType[K] & { type: K };
}[keyof ModuleRegistryType];

// Each call site is checked against the entry union; Dynamic cannot correlate
// an entry's type with its shape, so the lookup widens to accept any entry.
export const ModuleRegistry: Component<{ module: ModuleEntry }> = (props) => (
  <Dynamic
    component={
      moduleRegistry[props.module.type] as Component<{ shape: ModuleEntry }>
    }
    shape={props.module}
  />
);
