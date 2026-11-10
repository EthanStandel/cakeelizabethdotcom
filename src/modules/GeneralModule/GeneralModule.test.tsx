import { testScreenshot } from "~/test/utils";
import type { GeneralModuleType } from "~/models/modules/GeneralModule.shape";
import { GeneralModule } from "./GeneralModule";

testScreenshot("submodules", () => (
  <GeneralModule
    shape={
      {
        submodules: [
          {
            title: "Contact",
            body: "Reach out by phone or email and we'll discuss your vision.",
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
      } as GeneralModuleType
    }
  />
));
