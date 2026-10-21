import { Component } from "solid-js";
import { cx } from "cva";
import { useCmsFieldProps } from "~/lib/cms/CmsPathContext";
import { navigationSource, useSiteWide } from "~/primitives/SiteWideContext";

const lineClass =
  "origin-center transition-[translate,rotate,opacity] duration-(--menu-transition-duration) [transform-box:fill-box]";

export const MenuToggleButton: Component<{
  isOpen: boolean;
  controls: string;
  class?: string;
  onToggle: () => void;
}> = (props) => {
  const [navigation] = useSiteWide("navigation");
  const menuOpenCmsProp = useCmsFieldProps(() => "menuOpen", navigationSource);
  const menuCloseCmsProp = useCmsFieldProps(
    () => "menuClose",
    navigationSource,
  );

  return (
    <button
      type="button"
      aria-expanded={props.isOpen}
      aria-controls={props.controls}
      aria-label={
        props.isOpen
          ? (navigation()?.menuClose ?? "Close navigation")
          : (navigation()?.menuOpen ?? "Open navigation")
      }
      {...(props.isOpen ? menuCloseCmsProp() : menuOpenCmsProp())}
      class={cx(
        "cursor-pointer rounded-full p-3 text-primary-foreground",
        props.class,
      )}
      onClick={() => props.onToggle()}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        class="size-6"
      >
        <line
          x1="4"
          y1="6"
          x2="20"
          y2="6"
          class={cx(lineClass, props.isOpen && "translate-y-[6px] rotate-45")}
        />
        <line
          x1="4"
          y1="12"
          x2="20"
          y2="12"
          class={cx(lineClass, props.isOpen && "opacity-0")}
        />
        <line
          x1="4"
          y1="18"
          x2="20"
          y2="18"
          class={cx(lineClass, props.isOpen && "-translate-y-1.5 -rotate-45")}
        />
      </svg>
    </button>
  );
};
