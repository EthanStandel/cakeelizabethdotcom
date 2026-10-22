import { expect, test, vi } from "vitest";
import type { ContactFormModuleType } from "~/models/modules/ContactFormModule.shape";
import { expectScreenshot, render, settle, testScreenshot } from "~/test/utils";
import { ContactFormModule } from "./ContactFormModule";

vi.mock("./submitContactForm", () => ({
  submitContactForm: async () => true,
}));

const shape: ContactFormModuleType = {
  heading: "Request a quote",
  name: { label: "Name", requiredError: "Please tell us your name." },
  email: {
    label: "Email",
    requiredError: "We need an email to reply to.",
    invalidError: "That email doesn’t look quite right.",
  },
  phone: {
    label: "Phone",
    optionalLabel: "(optional)",
    placeholder: "207 555-0123",
    invalidError: "Please enter a 10-digit phone number.",
  },
  description: {
    label: "Tell us about your cake",
    placeholder:
      "e.g. A two-tier birthday cake for June 14th, about 40 guests. Blush and gold, lemon if possible — open to ideas!",
    hint: "Date, servings, theme and flavors help us quote faster — but rough ideas are perfectly fine.",
    requiredError: "Tell us a little about your cake.",
  },
  submitLabel: "Send request",
  failureMessage:
    "Looks like something went wrong, so please just shoot an email with what you're looking for over to [info@cakeelizabeth.com](mailto:info@cakeelizabeth.com)",
  sent: {
    heading: "Thank you, {firstName}",
    body: "We’ve received your request and will be in touch at {email} within 48 hours with questions or a quote.",
    resetLabel: "Send another",
  },
  footnote:
    "Prefer to talk? Call [207 370-4008](tel:2073704008) or email us directly [info@cakeelizabeth.com](mailto:info@cakeelizabeth.com) with images of your ideas!",
};

testScreenshot("form", () => <ContactFormModule shape={shape} />);

test("invalid", async () => {
  const screen = await render(() => <ContactFormModule shape={shape} />);
  await screen.getByRole("button", { name: "Send request" }).click();
  await expect
    .element(screen.getByText("Tell us a little about your cake."))
    .toBeVisible();
  await expectScreenshot(screen, "invalid");
});

test("sent", async () => {
  const screen = await render(() => <ContactFormModule shape={shape} />);
  await screen.getByLabelText("Name").fill("Ada Lovelace");
  await screen.getByLabelText("Email").fill("ada@example.com");
  await screen.getByLabelText("Tell us about your cake").fill("A lemon cake.");
  await screen.getByRole("button", { name: "Send request" }).click();
  await expect.element(screen.getByText("Thank you, Ada")).toBeVisible();
  await settle();
  await expectScreenshot(screen, "sent");
});
