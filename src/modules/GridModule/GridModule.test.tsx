import "../ModuleRegistry";
import { testScreenshot } from "~/test/utils";
import type { GridModuleType } from "~/models/modules/GridModule.shape";
import { GridModule } from "./GridModule";

testScreenshot("flavorMenuAndGeneral", () => (
  <GridModule
    shape={
      {
        items: [
          {
            type: "flavorMenu",
            antecedent: 1,
            heading: "Flavor menu",
            footnote:
              "All cakes are fully customizable! Mix and match any combination!",
          },
          {
            type: "general",
            antecedent: 1,
            submodules: [
              {
                title: "Contact",
                body: "[207 370-4008](tel:2073704008)  \n[info@cakeelizabeth.com](mailto:info@cakeelizabeth.com)\n\nReach out by phone or email and we'll discuss your vision and provide a quote within 48 hours.",
                ctaList: [
                  {
                    type: "link",
                    variant: "primary",
                    label: "Send an email",
                    url: "/contact",
                  },
                ],
              },
              {
                title: "About",
                heroImage: "/test/test.png",
                body: "Maine's local custom cake studio.",
              },
            ],
          },
        ],
      } as GridModuleType
    }
  />
));

testScreenshot("generalPair", () => (
  <GridModule
    shape={
      {
        items: [
          {
            type: "general",
            antecedent: 1,
            submodules: [
              {
                title: "About Elizabeth",
                body: "What started as a passion for baking grew into Maine's local custom cake studio.\n\nEvery cake is baked fresh from scratch using high-quality ingredients.",
                ctaList: [
                  {
                    type: "link",
                    variant: "primary",
                    label: "View gallery",
                    url: "/gallery",
                  },
                  {
                    type: "link",
                    variant: "secondary",
                    label: "Get in touch",
                    url: "/contact",
                  },
                ],
              },
            ],
          },
          {
            type: "general",
            antecedent: 1,
            submodules: [
              {
                heroImage: "/test/test.png",
                body: "> “Every occasion deserves something truly special.”",
              },
            ],
          },
        ],
      } as GridModuleType
    }
  />
));
