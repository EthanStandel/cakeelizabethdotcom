import { A, AnchorProps } from "@solidjs/router";
import { cx } from "cva";
import { Component, Show, splitProps } from "solid-js";

const textButtonBase =
  "uppercase inline-flex tracking-wide text-sm @max-dsk:text-base px-6 py-4 border hover:brightness-90 rounded-full @max-dsk:flex-[1_1_auto] text-center button-hover justify-center gap-2";

export const iconLinkButtonClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border hover:brightness-90 button-hover text-pr bg-primary text-primary-foreground border-primary";

export const primaryLinkButtonClass = cx(
  textButtonBase,
  "text-pr bg-primary text-primary-foreground border-primary",
);

export const secondaryLinkButtonClass = cx(
  textButtonBase,
  "text-primary-foreground dark:text-dark-primary-foreground bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary border-current",
);

const variants = {
  primary: primaryLinkButtonClass,
  secondary: secondaryLinkButtonClass,
  icon: iconLinkButtonClass,
};

const HREF_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

// The router's `A` resolves every href as a path of the site, so an href that
// carries its own scheme (tel:, mailto:, https:) renders as a plain anchor.
export const LinkButton: Component<
  { variant?: keyof typeof variants } & AnchorProps
> = (props) => {
  const [local, routerAnchorProps] = splitProps(props, ["variant", "class"]);
  const [, plainAnchorProps] = splitProps(routerAnchorProps, [
    "state",
    "replace",
    "noScroll",
    "activeClass",
    "inactiveClass",
    "end",
  ]);
  const className = () => cx(variants[local.variant ?? "primary"], local.class);

  return (
    <Show
      when={HREF_SCHEME_PATTERN.test(props.href)}
      fallback={<A {...routerAnchorProps} class={className()} />}
    >
      <a
        rel="noopener noreferrer"
        target="_blank"
        {...plainAnchorProps}
        class={className()}
      />
    </Show>
  );
};
