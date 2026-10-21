import { testScreenshot } from "~/test/utils";
import { VerticalStepperModule } from "./VerticalStepperModule";

testScreenshot("steps", () => (
  <VerticalStepperModule
    shape={{
      heading: "How to order",
      steps: [
        {
          title: "Reach out",
          description:
            "Send the form, call, or email with your occasion and any ideas you have in mind.",
        },
        {
          title: "Share what you know",
          description:
            "Not sure yet? That’s okay — we’ll work it out together. If you have them, these details help us get you a quote faster: Date needed, estimated servings, theme or color scheme, and flavors.",
        },
        {
          title: "Receive a quote",
          description: "Once we get you a quote, a deposit secures your date!",
        },
        {
          title: "Enjoy your cake",
          description: "We handle the rest — delivery or pickup available.",
        },
      ],
    }}
  />
));
