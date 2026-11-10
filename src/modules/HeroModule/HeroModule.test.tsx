import { testScreenshot } from "~/test/utils";
import type { HeroModuleType } from "~/models/modules/HeroModule.shape";
import { HeroModule } from "./HeroModule";

testScreenshot("left", () => (
  <HeroModule
    shape={
      {
        eyebrow: "Custom Cakes · Maine",
        content:
          "# Cakes that *tell your story*\n\nJust reach out and we'll bring your vision to life!",
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
      } as HeroModuleType
    }
  />
));

testScreenshot("centerRuleAbove", () => (
  <HeroModule
    shape={
      {
        alignment: "center",
        ruleAbove: true,
        content:
          "## Ready to begin?\n\nReach out early — wedding dates book quickly.",
        ctaList: [
          {
            type: "link",
            variant: "primary",
            label: "Request a consultation",
            url: "/contact",
          },
        ],
      } as HeroModuleType
    }
  />
));

testScreenshot("backgroundImage", () => (
  <HeroModule
    shape={
      {
        eyebrow: "Wedding cakes",
        content:
          "# Your perfect cake, *for your perfect day*\n\nFrom delicate floral tiers to bold modern designs.",
        ctaList: [
          {
            type: "link",
            variant: "primary",
            label: "Request a consultation",
            url: "/contact",
          },
        ],
        backgroundImage: "/test/test.png",
      } as HeroModuleType
    }
  />
));
