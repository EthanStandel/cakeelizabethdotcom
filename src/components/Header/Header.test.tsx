import { createSignal } from "solid-js";
import { test } from "vitest";
import { DSK_BREAKPOINT_PX } from "~/lib/utils/createBreakpoint";
import { expectScreenshot, render, settle } from "~/test/utils";
import { Header } from "./Header";

const renderHeader = () =>
  render(() => {
    const [isMenuOpen, setIsMenuOpen] = createSignal(false);
    return (
      <div class="relative flex min-h-dvh flex-col">
        <Header isMenuOpen={isMenuOpen()} onMenuOpenChange={setIsMenuOpen} />
      </div>
    );
  });

test("header", async () => {
  const screen = await renderHeader();
  await expectScreenshot(screen.getByRole("banner"), "header");
});

test.runIf(innerWidth < DSK_BREAKPOINT_PX)("menu open", async () => {
  const screen = await renderHeader();
  await screen.getByRole("button", { name: "Open navigation" }).click();
  await settle();
  await expectScreenshot(screen, "menu-open");
});
