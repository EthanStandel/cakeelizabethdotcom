import { A, AnchorProps } from "@solidjs/router";
import { cx } from "cva";
import { Component } from "solid-js";

const variants = {
  primary: "text-pr bg-primary text-primary-foreground border-primary",
  secondary:
    "text-primary-foreground dark:text-dark-primary-foreground bg-secondary hover:bg-primary hover:text-primary-foreground hover:border-primary border-current",
};

export const LinkButton: Component<
  { variant?: keyof typeof variants } & AnchorProps
> = (props) => (
  <A
    {...props}
    class={cx(
      "uppercase tracking-wide text-sm px-6 py-4 border transition-all duration-250 hover:brightness-90 hover:shadow-base active:shadow-none shadow-primary rounded-full @max-dsk:flex-[1_1_auto] text-center",
      variants[props.variant ?? "primary"]
    )}
  />
);
