import { testScreenshot } from "~/test/utils";
import type { HorizontalListModuleType } from "~/models/modules/HorizontalListModule.shape";
import { HorizontalListModule } from "./HorizontalListModule";

testScreenshot("enumerated", () => (
  <HorizontalListModule
    shape={
      {
        heading: "The wedding experience",
        enumerate: true,
        items: [
          {
            title: "Consultation",
            description:
              "We’ll discuss your vision, theme, and flavors — in person or by phone.",
          },
          {
            title: "Design",
            description:
              "A custom design tailored to your wedding aesthetic and colors.",
          },
          {
            title: "Tasting",
            description:
              "Sample cake and filling combinations before finalizing your menu.",
          },
          {
            title: "Delivery",
            description:
              "Delivered and set up at your venue — you just enjoy the day.",
          },
        ],
      } as HorizontalListModuleType
    }
  />
));

testScreenshot("plain", () => (
  <HorizontalListModule
    shape={
      {
        enumerate: false,
        items: [
          {
            title: "Fresh",
            description: "Baked from scratch using quality ingredients.",
          },
          {
            title: "Custom",
            description: "Every cake designed specifically for your occasion.",
          },
          {
            title: "Local",
            description: "Proud to serve the Maine community.",
          },
          {
            title: "Yours",
            description: "No two cakes are ever exactly alike.",
          },
        ],
      } as HorizontalListModuleType
    }
  />
));
