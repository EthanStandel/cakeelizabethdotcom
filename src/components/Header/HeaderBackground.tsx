import { Component, For } from "solid-js";
import { cx } from "cva";

const featherBlurLayerClasses = [
  "backdrop-blur-[2px] mask-b-from-75%",
  "backdrop-blur-xs mask-b-from-50% mask-b-to-75%",
  "backdrop-blur-sm mask-b-from-25% mask-b-to-50%",
];

export const HeaderBackground: Component<{ isExpanded: boolean }> = (props) => (
  <div
    class={cx(
      "absolute inset-x-0 top-0 -z-10 transition-[height,--header-feather] duration-(--menu-transition-duration)",
      props.isExpanded
        ? "h-[calc(100dvh+var(--spacing-header-feather))] [--header-feather:var(--spacing-header-feather)]"
        : "h-header",
    )}
  >
    <For each={featherBlurLayerClasses}>
      {(layerClass) => (
        <div
          class={cx(
            "absolute inset-x-0 bottom-0 h-(--header-feather)",
            layerClass,
          )}
        />
      )}
    </For>
    <div class="absolute inset-0 mask-b-from-[calc(100%-var(--header-feather))] mask-b-to-[calc(100%-var(--header-feather)*0.75)] backdrop-blur-md" />
    <div class="absolute inset-0 bg-white/60 mask-b-from-[calc(100%-var(--header-feather))]" />
  </div>
);
