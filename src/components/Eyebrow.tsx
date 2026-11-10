import { cx } from "cva";
import { JSX } from "solid-js";

export const Eyebrow = (props: JSX.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props}>
    <span class="uppercase tracking-widest text-sm highlight-border">
      {props.children}
    </span>
  </p>
);
