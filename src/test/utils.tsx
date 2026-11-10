import "~/app.css";
import { MemoryRouter } from "@solidjs/router";
import { JSX, Suspense } from "solid-js";
import { render as renderToDom } from "solid-js/web";
import { expect, onTestFinished, test } from "vitest";
import { page, type Locator } from "vitest/browser";
import { SiteWideProvider } from "~/primitives/SiteWideContext";

const SETTLED_FRAMES = 2;
const RENDERED_TEST_ID = "rendered";

document.documentElement.style.scrollbarWidth = "none";
document.body.classList.add("@container");

let pendingFetches = 0;
const browserFetch = window.fetch;

window.fetch = async (...args) => {
  pendingFetches++;
  try {
    return await browserFetch(...args);
  } finally {
    pendingFetches--;
  }
};

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

// Settled only after several quiet frames, because one finished fetch often starts the next (the manifest, then each entry it lists).
export async function settle() {
  let quietFrames = 0;
  while (quietFrames < SETTLED_FRAMES) {
    await nextFrame();
    quietFrames = pendingFetches > 0 ? 0 : quietFrames + 1;
  }
  await document.fonts.ready;
  await Promise.all(
    [...document.images].map((image) => image.decode().catch(() => undefined)),
  );
}

export async function render(ui: () => JSX.Element) {
  const container = document.body.appendChild(document.createElement("div"));
  container.dataset.testid = RENDERED_TEST_ID;
  const dispose = renderToDom(
    () => (
      <MemoryRouter
        root={() => (
          <SiteWideProvider>
            <Suspense>{ui()}</Suspense>
          </SiteWideProvider>
        )}
      />
    ),
    container,
  );
  onTestFinished(() => {
    dispose();
    container.remove();
  });
  await settle();
  return page.getByTestId(RENDERED_TEST_ID);
}

// The viewport first grows to the element's full height, because the test page is an iframe and what lies below its fold is never painted.
export async function expectScreenshot(locator: Locator, name: string) {
  const { innerWidth: width, innerHeight: height } = window;
  const elementHeight = Math.ceil(
    locator.element().getBoundingClientRect().bottom,
  );
  if (elementHeight > height) {
    await page.viewport(width, elementHeight);
    onTestFinished(() => page.viewport(width, height));
    await settle();
  }
  await expect(locator).toMatchScreenshot(name);
}

export function testScreenshot(name: string, ui: () => JSX.Element) {
  test(name, async () => {
    await expectScreenshot(await render(ui), name);
  });
}
