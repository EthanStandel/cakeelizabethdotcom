import { testScreenshot } from "~/test/utils";
import type { FlavorMenuModuleType } from "~/models/modules/FlavorMenuModule.shape";
import { FlavorMenuModule } from "./FlavorMenuModule";

testScreenshot("columns", () => (
  <FlavorMenuModule shape={{ layout: "columns" } as FlavorMenuModuleType} />
));

testScreenshot("stacked", () => (
  <FlavorMenuModule
    shape={
      {
        heading: "Flavor menu",
        footnote:
          "All cakes are fully customizable! Mix and match any combination!",
      } as FlavorMenuModuleType
    }
  />
));
