import { A, AnchorProps } from "@solidjs/router";
import { cx } from "cva";
import { Component } from "solid-js";

const textButtonBase =
  "uppercase inline-flex tracking-wide text-sm px-6 py-4 border hover:brightness-90 rounded-full @max-dsk:flex-[1_1_auto] text-center button-hover justify-center gap-2";

export const iconLinkButtonClass =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border hover:brightness-90 button-hover text-pr bg-primary text-primary-foreground border-primary";

const variants = {
  primary: cx(
    textButtonBase,
    "text-pr bg-primary text-primary-foreground border-primary",
  ),
  secondary: cx(
    textButtonBase,
    "text-primary-foreground dark:text-dark-primary-foreground bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary border-current",
  ),
  icon: iconLinkButtonClass,
};

export const LinkButton: Component<
  { variant?: keyof typeof variants } & AnchorProps
> = (props) => (
  <A {...props} class={cx(variants[props.variant ?? "primary"], props.class)} />
);
