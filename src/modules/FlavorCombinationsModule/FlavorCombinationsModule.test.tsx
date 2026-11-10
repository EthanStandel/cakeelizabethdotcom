import { testScreenshot } from "~/test/utils";
import { FlavorCombinationsModule } from "./FlavorCombinationsModule";

testScreenshot("withCta", () => (
  <FlavorCombinationsModule
    shape={{
      heading: "Popular combinations",
      cakeLabel: "Cake",
      fillingLabel: "Filling",
      frostingLabel: "Frosting",
      combinations: [
        {
          name: "Summer Garden",
          cake: "Lemon Poppy",
          filling: "Lemon Curd",
          frosting: "Lavender Honey",
        },
        {
          name: "Classic Celebration",
          cake: "Classic Vanilla",
          filling: "Bavarian Cream",
          frosting: "Swiss Meringue",
        },
        {
          name: "Dark & Indulgent",
          cake: "Dark Chocolate",
          filling: "Dark Ganache",
          frosting: "Salted Caramel",
        },
      ],
      ctaList: [
        {
          type: "link",
          variant: "primary",
          label: "Ask about flavors",
          url: "/contact",
        },
      ],
    }}
  />
));
